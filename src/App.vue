<template>
  <router-view />
</template>

<script>
import { provide, ref } from "vue";

export default {
  name: "App",
  setup() {
    const nickname = ref(
      localStorage.data === undefined
        ? ""
        : JSON.parse(localStorage.data).user.nickname
    );
    provide("nickname", nickname);
    const avatar = ref(
      localStorage.data === undefined
        ? ""
        : JSON.parse(localStorage.data).user.avatar
    );
    provide("avatar", avatar);

    const countM = ref(0);
    provide("countM", countM);
  },
};
</script>

<style>
@import "assets/css/style.css";
</style>
