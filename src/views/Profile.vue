<template>
  <FormListUsers
    :type="type"
    :nicknameProfile="nicknameProfile"
    v-if="showL"
    @close="showL = !showL"
  />
  <Header />
  <section class="sProfile">
    <div class="cardProfile">
      <img class="avatar" :src="avatar" />
      <div class="divProfile">
        <div class="topDivP">
          <div class="nameProfile">{{ nicknameProfile }}</div>
          <div class="iconsProfile">
            <a
              v-if="nickname.value !== nicknameProfile"
              href="#"
              @click="toWrite"
              class="iconProfile iMessage"
              ><i class="fas fa-feather-alt"></i
            ></a>
            <a
              v-if="nickname.value !== nicknameProfile"
              href="#"
              class="iconProfile iFollow"
              :style="styleFollow"
              @click="follow"
              ><i class="fas fa-heart"></i
            ></a>
            <a
              v-if="nickname.value === nicknameProfile"
              href="#"
              @click="$router.push('/settings')"
              class="iconProfile iSettings"
              ><i class="fas fa-cog"></i
            ></a>
          </div>
        </div>
        <div class="middleDivP">
          <div class="Subscriptions" @click="showS">
            Подписки <span>{{ countSubscriptions }}</span>
          </div>
          <div class="Followers" @click="showF">
            Подписчиков <span>{{ countFollowers }}</span>
          </div>
        </div>
        <div class="infoProfile"></div>
      </div>
    </div>
    <div class="ribbon">
      <div v-if="images.length === 0" class="notImg">Нету публикаций</div>
      <img
        v-else
        v-for="item in images"
        :key="item.id"
        class="boxImg"
        :src="item.photo"
      />
    </div>
  </section>
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormListUsers from "@/components/FormListUsers";

import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      showL: false,
      nicknameProfile: undefined,
      avatar: undefined,
      styleFollow: {
        color: "#000",
      },
      countFollowers: 0,
      countSubscriptions: 0,
      type: "",
      images: [],
    };
  },
  watch: {
    $route() {
      let url = this.url + "/api/users/" + this.$route.params.nickname;
      axios.get(url).then((response) => {
        this.nicknameProfile = response.data.nickname;
        this.avatar = response.data.avatar;
      });
      const params = new URLSearchParams();
      params.append("nickname", this.nickname.value);
      params.append("profile", this.$route.params.nickname);
      axios
        .get(this.url + "/api/follow/check", {
          params: params,
        })
        .then(() => {
          this.styleFollow = { color: "#f74b3b" };
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.styleFollow = { color: "#000" };
          }
        });
      axios
        .get(this.url + "/api/count-followers", {
          params: {
            nickname: this.$route.params.nickname,
          },
        })
        .then((response) => {
          this.countFollowers = response.data;
        });
      axios
        .get(this.url + "/api/count-subscriptions", {
          params: {
            nickname: this.$route.params.nickname,
          },
        })
        .then((response) => {
          this.countSubscriptions = response.data;
        });
      axios
        .get(this.url + "/api/image/my", {
          params: {
            nickname: this.$route.params.nickname,
          },
        })
        .then((response) => {
          this.images = response.data;
        });
    },
  },
  inject: ["nickname"],
  mounted() {
    let url = this.url + "/api/users/" + this.$route.params.nickname;
    axios.get(url).then((response) => {
      this.nicknameProfile = response.data.nickname;
      this.avatar = response.data.avatar;
    });
    const params = new URLSearchParams();
    params.append("nickname", this.nickname.value);
    params.append("profile", this.$route.params.nickname);
    axios
      .get(this.url + "/api/follow/check", {
        params: params,
      })
      .then(() => {
        this.styleFollow = { color: "#f74b3b" };
      })
      .catch((error) => {
        if (error.response.status === 404) {
          this.styleFollow = { color: "#000" };
        }
      });
    axios
      .get(this.url + "/api/count-followers", {
        params: {
          nickname: this.$route.params.nickname,
        },
      })
      .then((response) => {
        this.countFollowers = response.data;
      });
    axios
      .get(this.url + "/api/count-subscriptions", {
        params: {
          nickname: this.$route.params.nickname,
        },
      })
      .then((response) => {
        this.countSubscriptions = response.data;
      });
    axios
      .get(this.url + "/api/image/my", {
        params: {
          nickname: this.$route.params.nickname,
        },
      })
      .then((response) => {
        this.images = response.data;
      });
  },
  methods: {
    showS() {
      if (this.countSubscriptions) {
        this.showL = !this.showL;
        this.type = "subscriptions";
      }
    },
    showF() {
      if (this.countFollowers) {
        this.showL = !this.showL;
        this.type = "followers";
      }
    },
    toWrite() {
      this.$router.push({ path: `/conversations/${this.nicknameProfile}` });
    },
    follow() {
      let url = this.url + "/api/follow/checkbox";
      const params = new URLSearchParams();
      params.append("userNickname", this.nickname.value);
      params.append("followingNickname", this.nicknameProfile);
      axios
        .get(url, {
          params: params,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.log(error.response.data);
          }
        });
    },
  },
  components: {
    Header,
    Footer,
    FormListUsers,
  },
};
</script>

<style scoped>
@import "../assets/css/styleProfile.css";

.avatar {
  margin-left: 15vw;
  margin-right: 4vw;
  height: 20vh;
  border-radius: 50%;
}

.ribbon {
  margin-top: 5vh;
  margin-bottom: 7vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
}
</style>
