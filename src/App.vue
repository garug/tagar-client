<template>
  <div id="app">
    <HomePage
      @new="newRoom"
      :isLoading="waitingRoom"
      v-if="rooms.length === 0"
    />
    <ChatPage
      v-else
      :rooms="rooms"
      :user="user"
      @send:message="sendChatMessage"
      @exit="exitRoom"
      @new="newRoom"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Stomp, { Client, Frame } from "webstomp-client";

import { IRoom } from "./shared/interfaces";

import HomePage from "./views/HomePage.vue";
import ChatPage from "./views/ChatPage.vue";

@Component({
  components: {
    HomePage,
    ChatPage,
  },
})
export default class App extends Vue {
  waitingRoom = false;
  rooms: Array<IRoom> = [];
  stompClient: Client | undefined;
  user: string | undefined;

  newRoom() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send("/app/secured/new");
      this.waitingRoom = true;
    }
  }

  exitRoom(room: IRoom) {
    this.stompClient?.unsubscribe(`/chat/${room.id}/`);
  }

  sendChatMessage(room: IRoom, message: string) {
    console.log(room, message);
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(`/app/chat/${room.id}`, message);
    }
  }

  userSubscribe() {
    this.stompClient?.subscribe(`/user/${this.user}/`, (chatID) => {
      const room: IRoom = { id: chatID.body, messages: [] };
      this.roomSubscribe(room);
      this.rooms.push(room);
      this.waitingRoom = false;
    });
  }

  roomSubscribe(room: IRoom) {
    this.stompClient?.subscribe(`/chat/${room.id}`, (message) => {
      const receivedMessage = JSON.parse(message.body);
      const body = receivedMessage.message;
      const user = receivedMessage.from;
      room.messages.push({ body, user });
    });
  }

  connect() {
    this.stompClient?.connect(
      {},
      (frame) => {
        console.log(frame);
        this.user = frame?.headers["user-name"];
        this.userSubscribe();
      },
      (error) => console.log(error)
    );
  }

  created() {
    this.stompClient = Stomp.client("ws://localhost:8080/websocket");
    this.stompClient.debug = () => {};
    this.connect();
  }
}
</script>

<style lang="scss">
#app {
  font-family: Roboto, sans-serif;
  background-color: #2f2e2c;
  min-height: 100vh;
  width: 100%;
}
</style>
