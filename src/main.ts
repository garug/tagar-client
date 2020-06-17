import Vue from "vue";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

import App from "./App.vue";

const socket = io("http://localhost:8080");

Vue.use(VueSocketIOExt, socket);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
