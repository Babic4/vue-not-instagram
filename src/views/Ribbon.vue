<template>
  <Header />
  <section class="ribbon">
    <div v-if="gallery.length === 0" class="notImg">
      ЛЕНТА (Нету публикаций. Тут отображатся публикации людей на которых вы
      подписаны)
    </div>
    <img
      v-else
      v-for="item in gallery"
      :key="item.id"
      class="boxImg"
      :src="item.photo"
    />
  </section>
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      gallery: [],
    };
  },
  inject: ["avatar", "nickname"],
  mounted() {
    let url = this.url + "/api/image/others";
    axios
      .get(url, {
        params: {
          nickname: this.nickname.value,
        },
      })
      .then((response) => {
        this.gallery = response.data;
        this.$router.push("/");
      });
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
@import "../assets/css/styleRibbon.css";

.ribbon {
  margin-top: 5vh;
  margin-bottom: 7vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
  width: 66vw;
  flex: 1 0 auto;
}
</style>
