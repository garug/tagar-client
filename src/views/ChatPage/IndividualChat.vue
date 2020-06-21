<template>
  <div class="container-chat">
    <div class="main-messages">
      <div
        v-for="(msg, index) in room.messages"
        :id="`${msg.user}-${index}`"
        :key="`msg-${msg.user}-${index}`"
        :class="['msg', classUser(msg)]"
      >
        <p>{{ msg.body }}</p>
      </div>
    </div>
    <div class="main-typing" v-if="room.userTyping">
      <i>{{ room.userTyping }} is typing ...</i>
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
        :class="[
          'button is-primary has-text-white',
          { 'is-loading': isLoading },
        ]"
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
          @keypress="sendStatusTyping"
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
</template>

<script lang="ts">
import { Vue, Prop, Watch } from "vue-property-decorator";
import { IRoom, IMessage } from "../../shared/interfaces";
export default class IndividualChat extends Vue {
  @Prop() readonly room!: IRoom;
  text = "";
  isExiting = false;

  handleExit() {
    this.isExiting = true;
  }

  exit() {
    this.$emit("exit", this.room);
    this.isExiting = false;
  }

  sendMessage() {
    this.$emit("send:message", this.room, this.text);
    this.isExiting = false;
    this.text = "";
  }

  get isDisconnected() {
    return !this.room.active;
  }

  classUser(msg: IMessage): string {
    switch (msg.user) {
      case "me":
        return "my-msg";
      case "system":
        return "system-msg";
      default:
        return "stranger-msg";
    }
  }

  @Watch("room")
  onRoomChange(newRoom: IRoom, oldRoom: IRoom) {
    if (newRoom.id !== oldRoom.id) {
      this.isExiting = false;
    }
  }

  @Watch("room.userTyping")
  onUserTyping(newState: string, oldState: string) {
    if (newState != oldState) {
      this.room.userTyping = newState;
      setTimeout(() => {
        this.room.userTyping = "";
      }, 2000);
    }
  }

  sendStatusTyping() {
    this.$emit("send:typing", this.room);
  }
}
</script>
