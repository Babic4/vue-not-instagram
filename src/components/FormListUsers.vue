<template>
  <div class="formUsers">
    <div>
      <div class="listFSUsers">
        <div
          v-for="item in list"
          :key="item.nickname"
          @click="showProfile(item.nickname)"
          class="divFSUser"
        >
          <img class="imgFSUser" :src="item.avatar" />
          <div class="nickFSUser">{{ item.nickname }}</div>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" @click="$emit('close')"></div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      list: [],
    };
  },
  props: ["type", "nicknameProfile"],
  mounted() {
    console.log(this.type);
    if (this.type === "followers") {
      console.log("followers");
      let url = this.url + "/api/show-followers";
      axios
        .get(url, {
          params: {
            nickname: this.nicknameProfile,
          },
        })
        .then((response) => {
          this.list = response.data;
        });
    } else if (this.type === "subscriptions") {
      let url = this.url + "/api/show-subscriptions";
      axios
        .get(url, {
          params: {
            nickname: this.nicknameProfile,
          },
        })
        .then((response) => {
          this.list = response.data;
        });
    }
    console.log(this.list);
  },
  methods: {
    showProfile(nickname) {
      this.$router.push("/profile/" + nickname);
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
