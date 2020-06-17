import { IChatStore, IRoom } from "./interfaces";
import { Socket as ClientSocket } from "socket.io-client";

interface IIncomingMessage {
  chatId: string;
  message: string;
}

export default class NodeChatStore implements IChatStore {
  rooms: Array<IRoom> = [];
  waitingRoom = false;

  constructor(private client: typeof ClientSocket) {
    const store = this;
    this.client.on("room-subscribed", (roomId: string) => {
      const room: IRoom = { id: roomId, messages: [] };
      this.pushRoom(room);
      this.waitingRoom = false;
    });

    this.client.on("chat-message", (string: string) => {
      const { chatId, message } = JSON.parse(string);
      const room = store.rooms.find((r) => r.id === chatId);
      room?.messages.push({ body: message, user: "stranger" });
    });

    this.client.on("chat-exit", (chatId: string) => {
      const room = store.rooms.find((r) => r.id === chatId);
      if (room) {
        store.exitRoom(room);
      }
    });
  }

  newRoom(): void {
    this.waitingRoom = true;
    this.client.emit("new");
  }

  exitRoom(room: IRoom): void {
    this.client.emit("chat-exit", room.id);
  }

  sendChatMessage(room: IRoom, message: string): void {
    const outMessage = { chatId: room.id, message };
    room.messages.push({ body: message, user: "me" });
    this.client.emit("chat-message", outMessage);
  }

  private pushRoom(room: IRoom) {
    const indexInactivatedRoom = this.rooms.findIndex(
      (actualRoom) => !actualRoom.active
    );
    if (indexInactivatedRoom === -1) {
      this.rooms.push(room);
    } else {
      this.rooms.splice(indexInactivatedRoom, 1, room);
    }
  }
}
