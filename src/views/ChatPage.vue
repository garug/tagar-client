<template>
  <div class="centered-content main-page">
    <div :class="`content ${numberChat !== NumberView.ONE ? 'multiple' : ''}`">
      <div class="main-chat-views">
        <p class="main-heading">Nº Chats:</p>
        <label class="opt">
          <input
            type="radio"
            name="number-chat"
            :value="NumberView.ONE"
            v-model="numberChat"
            :disabled="!validChange(NumberView.ONE)"
          />
          <span>1</span>
        </label>
        <label class="opt">
          <input
            type="radio"
            name="number-chat"
            :value="NumberView.TWO"
            v-model="numberChat"
            :disabled="!validChange(NumberView.TWO)"
          />
          <span>2</span>
        </label>
        <label class="opt">
          <input
            type="radio"
            name="number-chat"
            :value="NumberView.FOUR"
            v-model="numberChat"
            :disabled="!validChange(NumberView.FOUR)"
          />
          <span>4</span>
        </label>
      </div>
      <IndividualChat
        v-for="room in rooms"
        @send:message="$emit('send:message', $event)"
        @send:typing="$emit('send:typing', $event)"
        @exit="$emit('exit', $event)"
        @new="$emit('new')"
        :isLoading="isLoading"
        :key="room.id"
        :room="room"
        :class="objTotalChat.class"
      />
    </div>
    <div :class="`modal ${warningChat ? 'is-active' : ''}`">
      <div @click="warningChat = false" class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <p>
            You're use a number of chats bellow your active chats. Please, exit
            one or more chats before continue.
          </p>
          <button
            @click="warningChat = false"
            class="button  is-primary is-small is-outlined"
          >
            Ok, I got
          </button>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { v4 as uuid } from "uuid";

import { IRoom, IMessage } from "../shared/interfaces";
import IndividualChat from "./ChatPage/IndividualChat.vue";

enum ChatView {
  ONE,
  TWO,
  FOUR,
}

@Component({
  components: { IndividualChat },
})
export default class ChatPage extends Vue {
  @Prop() rooms!: Array<IRoom>;
  @Prop() isLoading = false;
  NumberView: any = ChatView; // Treta pra funcionar no template
  numberChat = ChatView.ONE;
  warningChat = false;

  @Watch("numberChat")
  onNumberChatChange(val: ChatView, oldVal: ChatView) {
    this.resolveTotalChats();
  }

validChange(pretended: ChatView) {
    const pretendedViews = this.resolveObjTotalChat(pretended).totalChat;
    const actualViews = this.resolveObjTotalChat(this.numberChat).totalChat;
    const isDecrementation = pretendedViews < actualViews;
    if (isDecrementation) {
      const activeChats = this.rooms.filter((room) => room.active);
      return activeChats.length <= pretendedViews;
    } else {
      return true;
    }
  }

  resolveTotalChats() {
    this.rooms
      .filter((room) => !room.active)
      .forEach((inactiveRoom) => {
        const inactiveIndex = this.rooms.findIndex(
          (room) => room.id === inactiveRoom.id
        );
        this.rooms.splice(inactiveIndex, 1);
      });

    while (this.rooms.length < this.objTotalChat.totalChat) {
      this.rooms.push({ id: uuid(), messages: [], active: false });
    }
  }

  get objTotalChat() {
    return this.resolveObjTotalChat(this.numberChat);
  }

  resolveObjTotalChat(chatView: ChatView) {
    switch (chatView) {
      case ChatView.ONE:
        return { totalChat: 1, class: "one-view" };
      case ChatView.TWO:
        return { totalChat: 2, class: "two-view" };
      case ChatView.FOUR:
        return { totalChat: 4, class: "four-view" };
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  .content {
    position: relative;
    width: 96vw;
    height: 98%;
    display: flex;
    flex-wrap: wrap;
    max-width: 840px;
    margin-bottom: 0;

    &.multiple {
      max-width: 1440px;
    }
  }
}

.main-chat-views {
  position: absolute;
  top: 20px;
  right: -80px;
  display: flex;
  flex-direction: column;
  text-align: center;

  .main-heading {
    margin-bottom: 0 !important;
    color: $title-color;
    font-size: 12px;
  }
}

.one-view {
  width: 100%;
  height: 100%;
}

.two-view {
  width: 50%;
  height: 100%;
}

.four-view {
  width: 50%;
  height: 50%;
}

.opt {
  input {
    display: none;

    &:not([disabled]) ~ span {
      color: $title-color;
    }

    &:checked ~ span {
      color: $primary;
    }
  }

  span {
    font-weight: bolder;
    font-size: 17px;
  }
}
</style>
