<template>
  <div
    v-if="showOI"
    @click="
      showOI = !showOI;
      showP = false;
      showS = false;
      search = '';
      searchUsers = undefined;
    "
    class="overlayI"
  ></div>
  <header>
    <div class="borderH">
      <nav class="menu">
        <img class="logo-menu" src="/img/orange.svg" />
        <ul>
          <li class="plus">
            <router-link to="/photo-redactor"
              ><i class="fas fa-plus"></i
            ></router-link>
          </li>
          <li>
            <div class="popUpMenu">
              <a
                class="focus search"
                href="#"
                @click="
                  showS = !showS;
                  showP = false;
                  showOI = !showOI;
                "
                ><i class="fas fa-search"></i
              ></a>
              <div class="hidden hSearch" v-if="showS">
                <input
                  class="inpSearch"
                  type="text"
                  autocomplete="off"
                  placeholder="Поиск..."
                  v-model.trim="search"
                  @keyup="fSearch"
                />
                <div class="listUsers">
                  <div v-if="searchUsers === undefined"></div>
                  <div v-else-if="searchUsers.length === 0" class="nothing">
                    Ничего не найдено
                  </div>
                  <div
                    v-else
                    v-for="item in searchUsers"
                    :key="item.nickname"
                    class="divSUser"
                    @click="showProfile(item.nickname)"
                  >
                    <img class="imgSUser" :src="item.avatar" />
                    <div class="nickSUser">{{ item.nickname }}</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <a @click="toConversaions" class="iConversations">
              <i
                v-if="countM.value == 0"
                class="fas fa-envelope-open empty"
              ></i>
              <i v-else class="fas fa-envelope noEmpty"></i>
            </a>
          </li>
          <li>
            <router-link to="/"><i class="fas fa-layer-group"></i></router-link>
          </li>
          <li>
            <div class="popUpMenu">
              <a
                class="focus"
                href="#"
                @click="
                  showP = !showP;
                  showS = false;
                  showOI = !showOI;
                "
                ><img class="imgHeader" :src="avatar.value"
              /></a>
              <div class="hidden hMenu" v-if="showP">
                <ul class="profileMenu">
                  <li>
                    <a @click="toProfile" class="myProfile"
                      ><i class="fas fa-user-circle"></i><span>Профиль</span></a
                    >
                  </li>
                  <li>
                    <router-link to="/settings"
                      ><i class="fas fa-cog"></i
                      ><span>Настройки</span></router-link
                    >
                  </li>
                  <li>
                    <a @click="exit"
                      ><i class="fas fa-times-circle"></i><span>Выход</span></a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      showS: false,
      showP: false,
      showOI: false,
      searchUsers: undefined,
      search: "",
    };
  },
  inject: ["avatar", "nickname", "countM"],
  created() {
    axios
      .get("http://127.0.0.1:8000/api/countm/", {
        params: {
          nickname: this.nickname.value,
        },
      })
      .then((response) => {
        this.countM.value = response.data;
      });
  },
  // watch: {
  //   countM: function () {
  //     console.log("countM");
  //   },
  // },
  mounted() {
    // document.addEventListener("mouseup", (event) => {
    //   let container = document.getElementsByClassName("popUpMenu");
    //   if (container.contains(event.target).length === 1) {
    //     if (document.getElementsByClassName("focus").contains(event.target).length === 1) {
    //       // if ($(e.target).parent().next().css("visibility") == "hidden") {
    //       //   $(".hidden").css("visibility", "hidden");
    //       //   $(e.target).parent().next().css("visibility", "visible");
    //       // } else {
    //       //   $(".listUsers").children().remove();
    //       //   $(e.target).parent().next().children(".inpSearch").val("");
    //       //   $(e.target).parent().next().css("visibility", "hidden");
    //       // }
    //     }
    //   } else {
    //     // $(".listUsers").children().remove();
    //     // container.children(".hidden").children(".inpSearch").val("");
    //     // container.children(".hidden").css("visibility", "hidden");
    //   }
    // });
  },
  methods: {
    exit() {
      localStorage.removeItem("data");
      this.$router.push("/signin");
    },
    toProfile() {
      this.$router.push("/profile/" + this.nickname.value);
      this.showP = !this.showP;
      this.showOI = !this.showOI;
      this.search = "";
      this.searchUsers = undefined;
    },
    toConversaions() {
      this.$router.push("/conversations");
    },
    fSearch() {
      if (this.search) {
        console.log(this.search);
        let url = this.url + "/api/search-user";
        axios
          .get(url, { params: { keyword: this.search } })
          .then((response) => {
            if (response.data.length == 0) this.searchUsers = [];
            else {
              let i = undefined;
              response.data.forEach((element, index) => {
                if (element.nickname == this.nickname.value) {
                  i = index;
                }
              });
              if (i !== undefined) response.data.splice(i, 1);
              this.searchUsers = response.data;
            }
          })
          .catch(() => {
            this.searchUsers = [];
          });
      } else {
        this.searchUsers = undefined;
      }
    },
    showProfile(nickname) {
      this.$router.push("/profile/" + nickname);
      this.showS = !this.showS;
      this.showOI = !this.showOI;
    },
  },
};
</script>

<style>
.overlayI {
  position: fixed;
  /* background: rgba(255, 255, 255, 0.596); */
  overflow: auto;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
