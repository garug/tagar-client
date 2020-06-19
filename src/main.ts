import Vue from "vue";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

import App from "./App.vue";

const socket = io(process.env.VUE_APP_ENV_VARIABLE || "http://localhost:8080");

Vue.use(VueSocketIOExt, socket);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
