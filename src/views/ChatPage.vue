<template>
  <div class="centered-content">
    <IndividualChat
      v-for="room in rooms"
      @send:message="$emit('send:message', $event)"
      :isLoading="isLoading"
      :key="room.id"
      :room="room"
    />
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

<style lang="scss" scoped></style>
