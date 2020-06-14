<template>
  <div class="centered-content">
    <div class="has-text-centered">
      <h1 class="title is-1 has-text-primary my-0">tagar</h1>
      <p class="has-text-white">
        <span class="has-text-primary">small talks</span> with persons
      </p>
    </div>
    <button
      @click="$emit('new')"
      :class="['button mt-4 is-primary', { 'is-loading': isLoading }]"
    >
      Conversar
    </button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Client } from "webstomp-client";

@Component({})
export default class HomePage extends Vue {
  @Prop(Boolean) isLoading = false;

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}
</script>
