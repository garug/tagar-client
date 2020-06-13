<template>
  <div id="app">
    <div class="centered-content">
      <div class="has-text-centered">
        <h1 class="title is-1 has-text-primary my-0">tagar</h1>
        <p class="has-text-white">
          <span class="has-text-primary">small talks</span> with persons
        </p>
      </div>
      <button
        @click="newChat"
        :class="['button mt-4 is-primary', { 'is-loading': isLoading }]"
      >
        Conversar
      </button>

      <button
        @click="send"
        :class="['button mt-4 is-primary', { 'is-loading': isLoading }]"
      >
        teste
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Stomp, { Client, Frame } from "webstomp-client";

@Component({})
export default class App extends Vue {
  isLoading = false;
  stompClient: Client | undefined;

  newRoom() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send("/app/secured/new");
    }
  }

  send() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        "/app/secured/room",
        JSON.stringify({
          from: "Allef",
          message: "olá mundo",
        }),
        { id: "allef" }
      );
    }
  }

  newChat() {
    this.isLoading = true;
    this.stompClient?.connect(
      {},
      (frame) => {
        console.log(frame);
        this.isLoading = false
      },
      (error) => console.log(error)
    );
  }

  created() {
    this.stompClient = Stomp.client("ws://localhost:8080/websocket");
    this.stompClient.debug = () => {};
  }
}
</script>

<style lang="scss">
@import "./style.scss";

.centered-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100vh;
  flex-direction: column;
}

.button {
  font-weight: bold;
  font-size: 20px;
}
</style>
