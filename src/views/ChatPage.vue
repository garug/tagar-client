<template>
  <div class="centered-content">
    <div class="container-chat">
      <div class="main-messages">
        <div
          v-for="(msg, index) in room.messages"
          :id="`${msg.user}-${index}`"
          :key="`msg-${msg.user}-${index}`"
          :class="['msg', msg.user === user ? 'my-msg' : 'stranger-msg']"
        >
          <p>{{ msg.body }}</p>
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="main-bar">
        <button
          type="button"
          v-if="!isExiting && !isDisconnected"
          class="button is-black has-text-white"
          @click="handleExit"
        >
          Exit
        </button>
        <button
          type="button"
          v-if="isExiting && !isDisconnected"
          class="button is-danger has-text-white"
          @click="exit"
        >
          Confirm?
        </button>
        <button
          type="button"
          v-if="!isExiting && isDisconnected"
          :class="['button is-primary has-text-white', { 'is-loading': isLoading }]"
          @click="$emit('new')"
        >
          New Conversation
        </button>
        <div class="main-input">
          <input
            type="text"
            :disabled="isDisconnected"
            v-model="text"
            placeholder="Type here..."
          />
        </div>
        <button
          type="submit"
          :disabled="isDisconnected"
          class="button is-primary has-text-white is-hidden-mobile"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { IRoom, IMessage } from "../shared/interfaces";

@Component({})
export default class ChatPage extends Vue {
  @Prop() user!: string;
  @Prop() rooms!: Array<IRoom>;
  @Prop() isLoading = false;
  text = "";
  isExiting = false;
  isDisconnected = false;

  sendMessage() {
    this.$emit("send:message", this.room, this.text);
    this.isExiting = false;
    this.text = "";
  }

  handleExit() {
    this.isExiting = true;
  }

  exit() {
    this.$emit("exit", this.room);
    this.isExiting = false;
    this.isDisconnected = true;
  }

  get room() {
    return this.rooms[0];
  }

  @Watch('room')
  onRoomChange(newRoom: IRoom, oldRoom: IRoom) {
    if (newRoom.id !== oldRoom.id) {
      this.isExiting = false;
      this.isDisconnected = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.container-chat {
  height: 90vh;
  width: 75vw;
  max-width: 840px;
  background: $title-color;
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
  padding: 0 $mobile-spacing;
  margin-bottom: $mobile-spacing;
}

@media (min-width: $tablet) {
  .main-bar {
    padding: 0 $default-spacing;
    margin-bottom: $default-spacing;
  }
}

.main-input {
  flex-grow: 1;

  input {
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    height: 100%;
    padding: 0 $mobile-spacing;
    border: 0;
    outline: 0;
  }
}

@media (min-width: $tablet) {
  .main-input {
    input {
      padding: 0 $default-spacing;
    }
  }
}

.main-messages {
  overflow-y: auto;
  margin: 10px;
  margin-top: 0;
  margin-right: 0;
  padding-right: 10px;
  .msg {
    margin-bottom: 6px;
    width: 100%;
    overflow-x: auto;

    p {
      padding: 5px 10px;
      display: inline-flex;
      min-height: 35px;
      align-items: center;
      border-radius: 15px;
    }

    &.my-msg {
      text-align: right;

      p {
        background: #ffeaa7;
        text-align: left;
      }
    }

    &.stranger-msg {
      p {
        background: #dfe6e9;
      }
    }
  }
}

@media (min-width: $tablet) {
  .main-messages {
    margin: $default-spacing;
    margin-top: 10px;
    padding-right: $default-spacing;
    .msg {
      p {
        padding: 5px $default-spacing;
      }
    }
  }
}
</style>
