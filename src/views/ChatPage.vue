<template>
  <div class="centered-content">
    <!-- <div class="container-chat">
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
    </div> -->
    <IndividualChat v-for="room in rooms" :key="room.id" :room="room" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { IRoom, IMessage } from "../shared/interfaces";
import IndividualChat from "./ChatPage/IndividualChat.vue";

@Component({
  components: { IndividualChat },
})
export default class ChatPage extends Vue {
  @Prop() rooms!: Array<IRoom>;
  @Prop() isLoading = false;
}
</script>

<style lang="scss" scoped>
.container-chat {
  min-height: 98vh;
  width: 96vw;
  max-width: 840px;
  background: $title-color;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 3px;
}

@media (min-width: $tablet) {
  .container-chat {
    height: 90vh;
    min-height: 90vh;
    width: 75vw;
  }
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
    margin-bottom: 3px;
    margin-top: 3px;
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

    &.system-msg {
      text-align: center;
      font-weight: bold;
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

.main-typing {
  width: 100%;
  text-align: center;
  color: gray;
  font-size: 10px;
}
</style>
