import { IChatStore, IRoom } from "./interfaces";
import Stomp, { Client, Message, Frame, Subscription } from "webstomp-client";

interface IJavaRoom extends IRoom {
  subscription?: Subscription;
}

export default class JavaChat implements IChatStore {
  rooms: Array<IJavaRoom> = [];
  waitingRoom = false;
  stompClient: Client;
  user: string = "";

  constructor() {
    this.stompClient = Stomp.client("ws://localhost:8080/websocket");
    this.stompClient.debug = () => {};
    this.stompClient.connect(
      {},
      (frame) => {
        console.log(frame);
        this.user = frame?.headers["user-name"] || this.user;
        this.userSubscribe();
      },
      (error) => console.log(error)
    );
  }

  newRoom(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send("/app/secured/new");
      this.waitingRoom = true;
    }
  }

  exitRoom(room: IRoom): void {
    const actualRoom = this.rooms.find(
      (searchRoom) => searchRoom.id === room.id
    );
    if (actualRoom) {
      actualRoom.subscription?.unsubscribe();
      actualRoom.subscription = undefined;
    } else {
      throw new Error("Trying to exit of invalid room");
    }
  }

  sendChatMessage(room: IRoom, message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(`/app/chat/${room.id}`, message);
    }
  }

  sendChatTyping(room: IRoom):void {
    console.log("submit typing ...")
  }

  private userSubscribe(): void {
    this.stompClient?.subscribe(`/user/${this.user}/`, (chatID) => {
      const room: IRoom = { id: chatID.body, messages: [], active: true };
      this.roomSubscribe(room);
      this.pushRoom(room);
      this.waitingRoom = false;
    });
  }

  private roomSubscribe(room: IJavaRoom): void {
    room.subscription = this.stompClient?.subscribe(
      `/chat/${room.id}`,
      (message) => {
        const receivedMessage = JSON.parse(message.body);
        const body = receivedMessage.message;
        const user = receivedMessage.from;
        room.messages.push({ body, user });
      }
    );
  }

  private pushRoom(room: IRoom) {
    const indexInactivatedRoom = this.rooms.findIndex(
      (actualRoom) => !actualRoom.subscription
    );
    if (indexInactivatedRoom === -1) {
      this.rooms.push(room);
    } else {
      this.rooms.splice(indexInactivatedRoom, 1, room);
    }
  }
}
