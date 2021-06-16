<template>
  <section class="s1">
    <!-- test -->
    <img class="logo" src="/img/orange.svg" />
    <form action="" method="post" class="fSI">
      <div class="boxInput">
        <input
          class="inp"
          v-model.trim="login"
          type="text"
          name="Login"
          autocomplete="off"
          placeholder="Имя аккаунта"
          @blur="validateLogin"
        />
        <label class="error"></label>
      </div>
      <div class="boxInput">
        <input
          class="inp"
          v-model.trim="password"
          type="password"
          name="Password"
          autocomplete="off"
          placeholder="Пароль"
          @blur="validatePassword"
        />
        <label class="error"></label>
      </div>
      <input
        name="SignIn"
        class="buttonR"
        type="button"
        @click="signin"
        value="Авторизироваться"
      />
      <div class="reg">
        Отсутсвует аккаунт?
        <router-link to="/registration">Зарегистрироваться</router-link>
      </div>
    </form>
  </section>
  <Footer />
</template>

<script>
import Footer from "@/components/Footer";

import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
    };
  },
  components: {
    Footer,
  },
  inject: ["nickname", "avatar"],
  mounted() {
    document.getElementsByClassName("inp").forEach((el) => {
      el.addEventListener("focus", (event) => {
        event.target.classList.remove("placeholderred");
        event.target.classList.add("focus");
      });
    });
  },
  methods: {
    change(img) {
      this.image = img;
    },
    signin() {
      let inputs = document.getElementsByClassName("inp");
      for (let i = 0; i < inputs.length; i++)
        if (
          inputs[i].nextElementSibling.innerHTML === "" &&
          inputs[i].value === ""
        )
          return false;
      let url = this.url + "/api/signin/";
      axios
        .post(url, {
          nickname: this.login,
          password: this.password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.data = JSON.stringify(response.data);
          this.nickname.value = response.data.user.nickname;
          this.avatar.value = response.data.user.avatar;
          this.$router.push("/");
        })
        .catch((error) => {
          if (error.response.status === 400) {
            if (error.response.data.code === 1) {
              let inpL = document.getElementsByClassName("inp")[0];
              inpL.nextElementSibling.innerHTML = error.response.data.message;
              this.check(inpL);
            } else if (error.response.data.code === 2) {
              let inpP = document.getElementsByClassName("inp")[1];
              inpP.nextElementSibling.innerHTML = error.response.data.message;
              this.check(inpP);
            }
          }
        });
    },
    validateLogin(event) {
      if (!this.login) {
        event.target.nextElementSibling.innerHTML = "Пустое поле!";
      } else {
        if (/^[A-Za-z0-9_.]{3,16}$/.test(this.login)) {
          event.target.nextElementSibling.innerHTML = "";
        } else {
          event.target.nextElementSibling.innerHTML =
            "Имя аккаунта введено не верно!";
        }
      }
      this.check(event.target);
    },
    validatePassword(event) {
      if (!this.password) {
        event.target.nextElementSibling.innerHTML = "Пустое поле!";
      } else {
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.password)) {
          event.target.nextElementSibling.innerHTML = "";
        } else {
          event.target.nextElementSibling.innerHTML = "Пароль введен не верно!";
        }
      }
      this.check(event.target);
    },
    check(element) {
      element.classList.remove("focus");
      if (element.nextElementSibling.innerHTML == "") {
        element.classList.remove("wrong");
        element.classList.remove("placeholderred");
      } else {
        element.classList.add("wrong");
        element.classList.add("placeholderred");
      }
    },
  },
};
</script>

<style scoped>
.logo {
  height: 10vh;
  margin-bottom: 5vh;
}

.s1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  flex: 1 0 auto;
}

form {
  width: 40vw;
  height: 45vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-family: "Open Sans", sans-serif;
}

a {
  color: #01b5e6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.reg {
  font-size: 0.9em;
}
</style>
