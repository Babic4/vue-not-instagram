<template>
  <Form v-if="show" @close="show = false" v-on:newImg="change" />
  <Header />
  <section class="photoRedactor">
    <!-- <div class="boxPhoto">
      <img class="photo" />
    </div> -->
    <div class="boxPhoto">
      <img class="photo" :src="image" ref="photo" @click="show = true" />
    </div>
    <div class="param">
      <div>
        <label for="">Яркость</label>
        <div class="boxRange" name="brightness">
          <input
            v-model="brightness"
            class="range"
            min="-255"
            max="255"
            step="1"
            type="range"
            @change="changeB"
          />
          <input
            class="inputRange"
            type="text"
            @input="validateB"
            @focus="focus"
            @blur="blur"
            v-model="brightness"
          />
        </div>
        <label for="">Контрастность</label>
        <div class="boxRange" name="contrast">
          <input
            v-model="contrast"
            class="range"
            min="-50"
            max="150"
            step="1"
            @change="changeC"
            type="range"
          />
          <input
            class="inputRange"
            type="text"
            @input="validateC"
            @focus="focus"
            @blur="blur"
            v-model="contrast"
          />
        </div>
        <label for="">Фильтры</label>
        <div class="filters">
          <img
            class="filter"
            v-for="item in filterImg"
            :key="item"
            :src="item"
            @click="selectFilter"
          />
        </div>
      </div>
      <input
        name="AddPhoto"
        class="buttonR"
        type="button"
        value="Добавить"
        @click="addPhoto"
      />
    </div>
  </section>
  <Footer />
</template>

<script>
import { provide, ref } from "vue";

import Form from "@/components/FormPhoto";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      show: true,
      image: "/img/black.png",
      brightness: 0,
      contrast: 0,
      filterImg: [],
      notFilter: "",
    };
  },
  inject: ["avatar", "nickname"],
  components: {
    Header,
    Footer,
    Form,
  },
  mounted() {},
  setup() {
    const originalImg = ref("/img/black.png");
    provide("originalImg", originalImg);
  },
  methods: {
    change(img) {
      this.image = img;
      this.notFilter = img;
      let url = this.url + "/api/allFilter";
      axios
        .post(url, {
          photo: img,
        })
        .then((response) => {
          console.log(response.data);
          this.filterImg = response.data;
        });
    },
    addPhoto() {
      let url = this.url + "/api/image";
      axios
        .post(url, {
          ownerPhoto: this.nickname.value,
          photo: this.image,
        })
        .then(() => {
          this.$router.push("/");
        });
    },
    focus(event) {
      event.target.style.border = "1.3px solid #01b5e6";
      event.target.style.color = "#000";
    },
    blur(event) {
      event.target.style.border = "0.8px solid #7c878b";
      event.target.style.color = "#7c878b";
    },
    validateB() {
      if (!/^-?[0-9]{0,3}$/.test(this.brightness)) {
        this.brightness = this.brightness.substring(
          0,
          this.brightness.length - 1
        );
      }

      if (this.brightness > 255) {
        this.brightness = 255;
      } else if (this.brightness < -255) {
        this.brightness = -255;
      }
      this.fBrightness();
    },
    validateC() {
      if (!/^-?[0-9]{0,3}$/.test(this.brightness)) {
        this.brightness = this.brightness.substring(
          0,
          this.brightness.length - 1
        );
      }

      if (this.brightness > 150) {
        this.brightness = 150;
      } else if (this.brightness < -50) {
        this.brightness = -50;
      }
      this.fContrast();
    },
    changeC() {
      this.fContrast();
    },
    changeB() {
      this.fBrightness();
    },
    fBrightness() {
      let url = this.url + "/api/filter/";
      axios
        .post(url, {
          type: "brightness",
          photo: this.notFilter,
          number: this.brightness,
        })
        .then((response) => {
          console.log(response.data);
          this.image = response.data;
        });
    },
    fContrast() {
      let url = this.url + "/api/filter/";
      axios
        .post(url, {
          type: "contrast",
          photo: this.notFilter,
          number: this.contrast,
        })
        .then((response) => {
          console.log(response.data);
          this.image = response.data;
        });
    },
    selectFilter(event) {
      console.log(event.target.src);
      this.image = event.target.src;

      this.notFilter = event.target.src;
    },
  },
};
</script>

<style scoped>
@import "../assets/css/stylePhotoRedactor.css";
</style>
