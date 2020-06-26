<template>
  <div class="centered-content main-page">
    <div :class="`content ${numberChat !== NumberView.ONE ? 'multiple' : ''}`">
      <div class="main-chat-views">
        <label class="opt">
          <input
            type="radio"
            name="number-chat"
            @click="handleChangeChatView(NumberView.ONE)"
            :value="NumberView.ONE"
            :disabled="!validChange(NumberView.ONE)"
            v-model="numberChat"
          />
          <i>1</i>
        </label>
        <label class="opt">
          <input
            type="radio"
            name="number-chat"
            @click="handleChangeChatView(NumberView.TWO)"
            :value="NumberView.TWO"
            :disabled="!validChange(NumberView.TWO)"
            v-model="numberChat"
          />
          <i>2</i>
        </label>
        <label class="opt">
          <input
            type="radio"
            name="number-chat"
            @click="handleChangeChatView(NumberView.FOUR)"
            :value="NumberView.FOUR"
            :disabled="!validChange(NumberView.FOUR)"
            v-model="numberChat"
          />
          <i>4</i>
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

  handleChangeChatView(pretendedView: ChatView) {
    if (this.validChange(pretendedView)) {
      this.numberChat = pretendedView;
    } else {
      this.warningChat = true;
      this.$forceUpdate();
    }
  }

  validChange(oldVal: ChatView) {
    const isDecrementation =
      this.resolveObjTotalChat(oldVal).totalChat <
      this.resolveObjTotalChat(this.numberChat).totalChat;
    if (isDecrementation) {
      const activeChats = this.rooms.filter((room) => room.active);
      return activeChats.length < this.objTotalChat.totalChat;
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
    &.multiple {
      max-width: 1440px;
    }
  }
}

.main-chat-views {
  position: absolute;
  top: 0;
  right: -50px;
  display: flex;
  flex-direction: column;
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
</style>
