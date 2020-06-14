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
        @click="newRoom"
        :class="['button mt-4 is-primary', { 'is-loading': isLoading }]"
      >
        teste
      </button>
    </div>
    <!-- <div class="centered-content">
      <div class="container-chat">
        <div class="main-messages">
          <div class="msg my-msg">
            <p>Olá</p>
          </div>
          <div class="msg stranger-msg">
            <p>Olá estranho</p>
          </div>
        </div>
        <div class="main-bar">
          <button class="button is-black has-text-white">Exit</button>
          <div class="main-input">
            <input type="text" placeholder="Type here..." />
          </div>
          <button class="button is-primary has-text-white">Send</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Stomp, { Client, Frame } from "webstomp-client";

@Component({})
export default class App extends Vue {
  isLoading = false;
  stompClient: Client | undefined;
  user: string | undefined;

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
        })
      );
    }
  }

  newChat() {
    this.isLoading = true;
    this.stompClient?.connect(
      {},
      (frame) => {
        console.log(frame);
        this.user = frame?.headers["user-name"];
        this.isLoading = false;
        this.stompClient?.subscribe(`/user/${this.user}/`, (message) =>
          console.log(message)
        );
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

* {
  box-sizing: border-box;
}

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

.container-chat {
  height: 90vh;
  width: 75vw;
  max-width: 840px;
  background: $title-color;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3px;
}

.main-bar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
}

.main-input {
  flex-grow: 1;

  input {
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    height: 100%;
    padding: 0 20px;
    border: 0;
    outline: 0;
  }
}

.main-messages {
  .msg {
    margin-bottom: 6px;
    width: 100%;

    p {
      padding: 0 20px;
      display: inline-flex;
      height: 35px;
      align-items: center;
      border-radius: 15px;
    }

    &.my-msg {
      text-align: right;
      p {
        background: #ffeaa7;
      }
    }

    &.stranger-msg {
      p {
        background: #dfe6e9;
      }
    }
  }
}
</style>
