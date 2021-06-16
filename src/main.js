import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
// import VueSocketIO from "vue-3-socket.io";

// const socketio = new VueSocketIO({
//   debug: true,
//   connection: "http://localhost:8081",
//   vuex: {
//     store,
//     actionPrefix: "SOCKET_",
//     mutationPrefix: "SOCKET_",
//   },
// });

const app = createApp(App).use(store).use(router); //.use(socketio)

app.config.globalProperties.$nickname = "";
app.config.globalProperties.$avatar = "";
app.config.globalProperties.$countM = 0;

app.mount("#app");
