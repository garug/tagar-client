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
      :isLoading="waitingRoom"
      @send:message="sendChatMessage"
      @exit="exitRoom"
      @new="newRoom"
      @send:typing="sendChatTyping"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { IRoom, IChatStore } from "./shared/interfaces";
import NodeChatStore from "./shared/NodeChatStore";

import HomePage from "./views/HomePage.vue";
import ChatPage from "./views/ChatPage.vue";
import { Socket } from "vue-socket.io-extended";

interface IIncomingMessage {
  room: IRoom;
  message: string;
}

@Component({
  components: {
    HomePage,
    ChatPage,
  },
})
export default class App extends Vue {
  socket: IChatStore = new NodeChatStore(this.$socket.client);

  newRoom() {
    this.socket.newRoom();
  }

  exitRoom(room: IRoom) {
    this.socket.exitRoom(room);
  }

  sendChatMessage({ room, message }: IIncomingMessage) {
    this.socket.sendChatMessage(room, message);
  }

  sendChatTyping(room: IRoom) {
    this.socket.sendChatTyping(room);
  }

  get waitingRoom() {
    return this.socket.waitingRoom;
  }

  get rooms() {
    return this.socket.rooms;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Roboto, sans-serif;
  min-height: 100%;
  width: 100%;
  display: contents;
}
</style>
