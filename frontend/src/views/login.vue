<template>
  <div>
    <msg-modal :msg="msg" @close="msg=null" />
    <div class="login-form">
      <div class="title">
        <span></span>
        <h1>Qwello</h1>
      </div>
      <div class="board">
        <p class="title">{{ title }}</p>
        <form @submit.prevent="login">
          <input
            class="username"
            v-model="user.username"
            placeholder="Enter Username"
          />
          <input
            v-if="!isLogin"
            v-model="user.fullname"
            class="fullname"
            placeholder="Enter Full Name"
          />
          <div>
            <input
              :type="passwordType"
              v-model="user.password"
              class="password"
              placeholder="Enter Password"
              autocomplete
            />
          </div>
          <button type="submit">{{ btnTitle }}</button>
        </form>
        <p class="alternative">OR</p>
        <button class="gmail-login-btn" @click="googleLogin"><span></span> Login with Gmail</button>
        <hr />
        <p class="sign-in" @click="isLogin = !isLogin">Can't log in? <ul><li>{{ isSignup }}</li></ul></p>
      </div>
    </div>
  </div>
</template>

<script>
import msgModal from "@/components/msg-modal.vue";

export default {
  components: {
    msgModal,
  },
  data() {
    return {
      user: {
        username: "",
        fullname: "",
        password: "",
        imgUrl: "",
      },
      msg: null,
      isLogin: true,
      isPasswordShown: false,
    };
  },
  computed: {
    isSignup() {
      return this.isLogin ? "Sign up for an account" : "Back";
    },
    title() {
      return this.isLogin ? "Log in to Qwello" : "Sign up";
    },
    btnTitle() {
      return this.isLogin ? "Log in" : "Sign up";
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    passwordType() {
      return this.isPasswordShown ? "text" : "password";
    },
  },
  created() {},
  methods: {
    async login() {
      var user = null;
      try {
        if (this.isLogin) {
          if (!this.user.username) {
            this.loginMsg("Please enter username/password");
            return;
          }
          user = await this.$store.dispatch({ type: "login", user: this.user });
          if (user) this.$router.push("/board");
          else this.loginMsg("Failed to login", "Login faild");
        } else {
          user = await this.$store.dispatch({
            type: "signup",
            user: this.user,
          });
          if (user) this.$router.push("/board");
          this.loginMsg("Please fill up the form", "Sign up faild");
        }
        this.$store.dispatch({ type: "getUsers" });
      } catch (err) {
        this.loginMsg("Failed to login", "Login faild");
      }
    },
    loginMsg(value, title = "Error", event) {
      this.msg = {
        value,
        title,
        event,
        background:false,
        controls: { ok: "" },
      };
    },
    async googleLogin() {
      try {
        const googleUser = await this.$gAuth.signIn();
        this.user.fullname = googleUser.getBasicProfile().jf;
        this.user.username = googleUser.getBasicProfile().jf;
        this.user.username = this.user.username.replace(/\s/g, "");
        this.user.password = googleUser.getBasicProfile().HW
          ? googleUser.getBasicProfile().HW
          : googleUser.getBasicProfile().sW;
        this.user.imgUrl = googleUser.getBasicProfile().oN
          ? googleUser.getBasicProfile().oN
          : googleUser.getBasicProfile().RM;

        if (this.isLogin) {
          await this.$store.dispatch({ type: "login", user: this.user });
        } else {
          await this.$store.dispatch({ type: "signup", user: this.user });
        }
        this.$router.push("/board");
      } catch (e) {
        console.log("login faild", e);
      }
    },
  },
};
</script>
