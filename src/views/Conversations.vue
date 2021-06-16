<template>
  <Header />
  <section class="conversations">
    <div class="receivers">
      <div class="receiver" v-if="dontConv" @click.stop="selectDontConv">
        <img class="imgReceiver" :src="dontConv.avatar" />
        <div class="name-lMessage">
          <div class="nameReceiver">
            {{ dontConv.nickname }}
          </div>
          <div class="lastMessage"></div>
        </div>
        <div class="dateLastMessage"></div>
      </div>
      <div
        class="receiver"
        v-for="item in conversations"
        :key="item.convId"
        @click.stop="selectConv(item)"
      >
        <img class="imgReceiver" :src="item.avatar" />
        <div class="name-lMessage">
          <div class="nameReceiver">
            {{ item.nickname }}
            <i
              v-if="item.status && item.ownerMessage != this.nickname.value"
              class="fas fa-circle colorR"
            ></i>
          </div>
          <div class="lastMessage">
            <span v-if="item.ownerMessage == this.nickname.value">Вы: </span
            >{{ item.message }}
          </div>
        </div>
        <div class="dateLastMessage">
          {{ convertDateLastM(item.datetimeAdd) }}
        </div>
      </div>
    </div>
    <div class="divConversation">
      <div class="headerConversation">
        <img class="headerImgReceiver" :src="userAvatar" />
        <div class="headerNameReceiver">{{ userNickname }}</div>
      </div>
      <div class="conversation" ref="conv">
        <template v-for="(item, index) in messages" :key="item.id">
          <div v-if="check(item, index)" class="messageN">
            <img
              class="imgReceiverInM"
              :src="
                item.ownerMessage == nickname.value ? avatar.value : userAvatar
              "
            />
            <div class="middleGroupM">
              <div class="nameReceiverInM">{{ item.ownerMessage }}</div>
              <div class="tMessage">{{ item.message }}</div>
            </div>
            <div class="dateMessage">{{ convertDateM(item.datetimeAdd) }}</div>
          </div>
          <div v-else class="message">
            <div class="marginLM"></div>
            <div class="middleGroupM">
              <div class="tMessage">{{ item.message }}</div>
            </div>
            <div class="dateMessage">{{ convertDateM(item.datetimeAdd) }}</div>
          </div>
        </template>
      </div>
      <div class="inputConversation" v-if="currentConversation">
        <input
          v-model="message"
          autocomplete="off"
          placeholder="Написать сообщение..."
          type="text"
          @focus="isActive = !isActive"
          @blur="isActive = !isActive"
          @keyup.enter="sendMessage"
          :class="[isActive ? 'activeInput' : '', 'inputMessage']"
        />
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Pusher from "pusher-js";

import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      conversations: [],
      currentConversation: undefined,
      messages: [],
      isActive: false,
      userNickname: undefined,
      userAvatar: undefined,
      message: "",
      newConversation: undefined,
      dontConv: undefined,
    };
  },
  created() {
    this.subscribe();
  },
  inject: ["nickname", "avatar", "countM"],
  mounted() {
    if (this.$route.params.user) {
      const params = new URLSearchParams();
      params.append("nickname", this.nickname.value);
      params.append("user", this.$route.params.user);
      axios
        .get(this.url + "/api/ischat", {
          params: params,
        })
        .then((response) => {
          this.setConversation(response.data);
          this.getConversations();
          this.getMessages(response.data.convId);
        })
        .catch((error) => {
          this.dontConv = error.response.data.user;
          this.getConversations();
          this.currentConversation = error.response.data.user;
          this.userNickname = error.response.data.user.nickname;
          this.userAvatar = error.response.data.user.avatar;
        });
    } else {
      this.getConversations();
    }
  },
  watch: {
    async $route() {
      if (this.$route.params.user) {
        const params = new URLSearchParams();
        params.append("nickname", this.nickname.value);
        params.append("user", this.$route.params.user);
        await axios
          .get(this.url + "/api/ischat", {
            params: params,
          })
          .then(async (response) => {
            await axios.put(this.url + "/api/chat/" + response.data.convId, {
              user: this.$route.params.user,
            });
            this.setConversation(response.data);
            this.getConversations();
            this.getMessages(response.data.convId);
          })
          .catch((error) => {
            this.dontConv = error.response.data.user;
            this.getConversations();
            this.currentConversation = error.response.data.user;
            this.userNickname = error.response.data.user.nickname;
            this.userAvatar = error.response.data.user.avatar;
          });
      } else {
        this.getConversations();
      }
    },
  },
  updated: function () {
    // console.log("update");
    this.$refs.conv.scrollTop = this.$refs.conv.scrollHeight;
    // this.getConversations();
    let divR = document.querySelectorAll(".receiver");
    divR.forEach((element) => {
      if (
        element
          .querySelector(".nameReceiver")
          .innerHTML.slice(
            0,
            element.querySelector(".nameReceiver").innerHTML.indexOf(" ")
          ) == this.$route.params.user ||
        element.querySelector(".nameReceiver").innerHTML ==
          this.$route.params.user
      ) {
        element.style.background = "#ececec";
      } else {
        element.style.background = "#fff";
      }
    });
    // axios
    //   .put(this.url + "/api/chat/" + this.currentConversation.convId, {
    //     user: this.$route.params.user,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //   });
  },
  methods: {
    subscribe() {
      let vw = this;
      let pusher = new Pusher("7abb0372967b08f5bcda", {
        cluster: "eu",
      });

      let channel = pusher.subscribe("my-channel");
      channel.bind("my-event", async function (data) {
        await axios.put(vw.url + "/api/chat/" + vw.currentConversation.convId, {
          user: vw.userNickname,
        });
        await axios
          .get(vw.url + "/api/countm/", {
            params: {
              nickname: vw.nickname.value,
            },
          })
          .then((response) => {
            vw.countM.value = response.data;
          });
        vw.getConversations();
        if (vw.currentConversation.convId == data.message.convId) {
          vw.getMessages(data.message.convId);
          // vw.messages.push(data.message);
        }
      });
    },
    // connct(){
    //   if(this.currentConversation.convId){
    //     let vm = this;
    //     this.getMessages(this.currentConversation.convId);
    //     window.Echo.private("chat." + this.currentConversation.convId)
    //     .listen('.message.new', () => {
    //       vm.getMessages(this.currentConversation.convId);
    //     })
    //   }
    // },
    check(item, index) {
      if (index === 0) return true;
      if (this.messages[index - 1].ownerMessage !== item.ownerMessage)
        return true;
      return false;
    },
    async getConversations() {
      await axios
        .get(this.url + "/api/chat/" + this.nickname.value)
        .then((response) => {
          this.conversations = response.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.log(error.response.data);
          }
        });
    },
    async setConversation(conversation) {
      this.currentConversation = conversation;
      let user =
        conversation.sender == this.nickname.value
          ? conversation.receiver
          : conversation.sender;
      await axios
        .get(this.url + "/api/users/" + user)
        .then((response) => {
          this.userNickname = response.data.nickname;
          this.userAvatar = response.data.avatar;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.log(error.response.data);
          }
        });
      // this.activeReceiver(event);
      await axios
        .put(this.url + "/api/chat/" + conversation.convId, {
          user: user,
        })
        .then(() => {
          // console.log(response.data);
        });
    },
    async getMessages(conId) {
      await axios
        .get(this.url + "/api/chat/" + conId + "/messages")
        .then((response) => {
          // console.log(response.data);
          this.messages = response.data;
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.log(error.response.data);
          }
        });
    },
    async sendMessage() {
      if (this.message === "") return;

      if (!this.currentConversation.convId) {
        let lastId = undefined;
        let idConv = undefined;
        await axios
          .post(this.url + "/api/conv/", {
            sender: this.nickname.value,
            receiver: this.currentConversation.nickname,
          })
          .then((response) => {
            console.log(response.data);
            idConv = response.data.id;
          });
        await axios
          .post(this.url + "/api/chat/", {
            convId: idConv,
            ownerMessage: this.nickname.value,
            message: this.message,
            status: 1,
          })
          .then((response) => {
            console.log(response.data);
            this.message = "";
            lastId = response.data.id;
          });
        console.log(idConv + " " + lastId);
        await axios
          .put(this.url + "/api/conv/" + idConv, {
            lastMessageId: lastId,
          })
          .then((response) => {
            console.log(response.data);
            this.currentConversation = response.data.lastMessageId;
          });
      } else {
        let lastId = undefined;
        let url = this.url + "/api/chat/";
        await axios
          .post(url, {
            convId: this.currentConversation.convId,
            ownerMessage: this.nickname.value,
            message: this.message,
            status: 1,
          })
          .then((response) => {
            // console.log(response.data);
            this.message = "";
            lastId = response.data.id;
          });
        await axios
          .put(this.url + "/api/conv/" + this.currentConversation.convId, {
            lastMessageId: lastId,
          })
          .then((response) => {
            console.log(response.data);
          });
      }
      // console.log(this.messages);
      // this.$socket.emit("customEmit", "MyMessage");
    },
    selectConv(conv) {
      let user =
        conv.sender == this.nickname.value ? conv.receiver : conv.sender;
      this.$router.push("/conversations/" + user);
      this.activeReceiver(event);
    },
    selectDontConv() {
      this.$router.push("/conversations/" + this.dontConv.nickname);
      this.messages = undefined;
      this.activeReceiver(event);
    },
    convertDateM(datetime) {
      let DateTime = new Date(datetime);
      return (
        DateTime.toLocaleTimeString() +
        " " +
        DateTime.getDate() +
        "/" +
        (DateTime.getMonth() + 1) +
        "/" +
        DateTime.toLocaleDateString().slice(8)
      );
    },
    convertDateLastM(datetime) {
      let Days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      let nowDate = new Date();
      let DateTime = new Date(datetime);
      if (DateTime.getDate() == nowDate.getDate()) {
        return DateTime.toLocaleTimeString().slice(0, -3);
      } else if (nowDate.setDate(nowDate.getDate() - 7) < DateTime) {
        return Days[DateTime.getDay()];
      } else {
        return (
          DateTime.getDate() +
          "/" +
          (DateTime.getMonth() + 1) +
          "/" +
          DateTime.toLocaleDateString().slice(8)
        );
      }
    },
    activeReceiver(event) {
      let divR = document.querySelectorAll(".receiver");
      divR.forEach((element) => {
        element.style.background = "#fff";
      });
      event.currentTarget.style.background = "#ececec";
    },
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
@import "../assets/css/styleConversations.css";

.activeInput {
  border: 1.3px solid #01b5e6;
  color: #000;
}
</style>
