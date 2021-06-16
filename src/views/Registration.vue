<template>
  <Form v-if="show" @close="show = false" v-on:newImg="change" />
  <section class="s1">
    <!-- test -->
    <div class="H">Регистрация</div>
    <div class="columns">
      <div class="cropImg">
        <img class="avatar" :src="image" ref="avatar" @click="show = true" />
      </div>
      <form id="info" action="" method="post">
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
            type="text"
            v-model.trim="email"
            name="Email"
            autocomplete="off"
            placeholder="Email"
            @blur="validateEmail"
          />
          <label class="error"></label>
        </div>
        <div class="boxInput">
          <input
            class="inp"
            v-model.trim="phone"
            type="text"
            name="Phone"
            autocomplete="off"
            placeholder="Номер телефона"
            @blur="validatePhone"
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
        <div class="boxInput">
          <input
            class="inp"
            v-model.trim="confirmPassword"
            type="password"
            name="ConfirmPassword"
            autocomplete="off"
            placeholder="Повторите Пароль"
            @blur="validateCPassword"
            ref="confirmPassword"
          />
          <label class="error"></label>
        </div>
        <input
          name="Registration"
          class="buttonR"
          type="button"
          @click="registration"
          value="Зарегистрироваться"
        />
        <!-- <div class="reg">Отсутсвует аккаунт? <a href="#">Зарегистрироваться</a></div> -->
      </form>
    </div>
  </section>
  <Footer />
</template>

<script>
import { provide, ref } from "vue";

import Form from "@/components/FormAvatar";
import Footer from "@/components/Footer";

import axios from "axios";

export default {
  data() {
    return {
      url: "http://127.0.0.1:8000",
      show: false,
      image: "/img/user.png",
    };
  },
  components: {
    Footer,
    Form,
  },
  mounted() {
    document.getElementsByClassName("inp").forEach((el) => {
      el.addEventListener("focus", (event) => {
        event.target.classList.remove("placeholderred");
        event.target.classList.add("focus");
      });
    });
  },
  setup() {
    const originalImg = ref("/img/user.png");
    provide("originalImg", originalImg);
  },
  methods: {
    change(img) {
      this.image = img;
    },
    registration() {
      let inputs = document.getElementsByClassName("inp");
      for (let i = 0; i < inputs.length; i++)
        if (
          inputs[i].nextElementSibling.innerHTML === "" &&
          inputs[i].value === ""
        )
          return false;
      let url = this.url + "/api/register/";
      axios
        .post(url, {
          nickname: this.login,
          password: this.password,
          avatar: this.image,
          phone: this.phone,
          email: this.email,
        })
        .then((response) => {
          console.log(response.data);
          this.$router.push("/signin");
        });
    },
    validateLogin(event) {
      if (!this.login) {
        event.target.nextElementSibling.innerHTML = "Пустое поле!";
      } else {
        let url = this.url + "/api/users/" + this.login;
        axios
          .get(url)
          .then(() => {
            event.target.nextElementSibling.innerHTML =
              "Данное имя уже занято!";
            this.check(event.target);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              if (/^[A-Za-z0-9_.]{3,16}$/.test(this.login)) {
                event.target.nextElementSibling.innerHTML = "";
              } else {
                event.target.nextElementSibling.innerHTML =
                  "Имя аккаунта введено не верно!";
              }
              this.check(event.target);
            }
          });
      }
      this.check(event.target);
    },
    validateEmail(event) {
      if (!this.email) {
        event.target.nextElementSibling.innerHTML = "Пустое поле!";
      } else {
        let url = this.url + "/api/users/email/" + this.email;
        axios
          .get(url)
          .then(() => {
            event.target.nextElementSibling.innerHTML =
              "Данный Email уже занят!";
            this.check(event.target);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              if (
                /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(this.email)
              ) {
                event.target.nextElementSibling.innerHTML = "";
              } else {
                event.target.nextElementSibling.innerHTML =
                  "Email введен не верно!";
              }
              this.check(event.target);
            }
          });
      }
      this.check(event.target);
    },
    validatePhone(event) {
      if (!this.phone) {
        event.target.nextElementSibling.innerHTML = "Пустое поле!";
      } else {
        if (/^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/.test(this.phone)) {
          event.target.nextElementSibling.innerHTML = "";
        } else {
          event.target.nextElementSibling.innerHTML =
            "Телефон введен не верно!";
        }
      }
      this.check(event.target);
    },
    validatePassword(event) {
      // if (this.confirmPassword) {
      //   // ДОДЕЛАТЬ
      //   // this.$refs.confirmPassword.nextElementSibling.$emit('blur');
      // }
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
    validateCPassword(event) {
      if (!this.confirmPassword) {
        event.target.nextElementSibling.innerHTML = "Пустое поле!";
      } else {
        if (this.password == this.confirmPassword) {
          event.target.nextElementSibling.innerHTML = "";
        } else {
          event.target.nextElementSibling.innerHTML = "Пароль не совпадает!";
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

.H {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 5vh;
  margin-top: 1vh;
  margin-bottom: 2vh;
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
  height: 78vh;
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

.columns {
  width: 100vw;
  display: flex;
  justify-content: space-between;
}

.cropImg {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#info {
  padding-right: 10vw;
  width: 40%;
}

.avatar {
  cursor: pointer;
  width: 50%;
  border-radius: 50%;
}

.avatar:hover {
  width: 49%;
}

.avatar {
  cursor: pointer;
  width: 50%;
  border-radius: 50%;
}
</style>
