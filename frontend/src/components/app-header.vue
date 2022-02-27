<template>
  <section>
    <header
      v-if="isHeaderEnabled"
      class="home-header full"
      :style="{ position: 'absolute' }"
    >
      <div class="logo">
        <font-awesome-icon class="trello-icon" :icon="['fab', 'trello']" />
        <span>Qwello</span>
      </div>
      <div class="btns" v-if="$route.name !== 'login'">
        <button @click="login" v-if="!loggedinUser">Log in</button>
        <button v-else @click="logOut">Log Out</button>
      </div>
      <div class="btns" v-else>
        <button @click="$router.push('/')">Home</button>
      </div>
    </header>
    <header v-else class="main-header full" :class="headerClass">
      <div class="menu" @click.stop="isShowMenu = true">
        <span class="icon"></span>
      </div>
      <div class="logo">
        <div @click="$router.push('/')">
          <font-awesome-icon class="trello-icon" :icon="['fab', 'trello']" />
          <span>Qwello</span>
        </div>
      </div>

      <div class="create">
        <button class="create-btn" @click.stop="isCreateModal = true"></button>
      </div>
      <font-awesome-icon class="not-icon" :icon="['fas', 'bell']" />
      <span @click="logOut">
        <avatar
          v-if="user"
          class="avatar"
          :size="32"
          :username="user.fullname"
          :src="user.imgUrl"
        ></avatar>
      </span>
      <menu-modal v-if="isShowMenu" @close="isShowMenu = false"></menu-modal>
      <create-board
        v-if="isCreateModal"
        @close="isCreateModal = false"
      ></create-board>
    </header>
  </section>
</template>
<script>
import Avatar from "vue-avatar";
import menuModal from "../components/menu-modal.vue";
import createBoard from "./board/create-board.vue";

export default {
  name: "app-header",
  props: {
    user: Object,
  },
  data() {
    return {
      isShowMenu: false,
      isCreateModal: false,
    };
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
    async logOut() {
      this.user = await this.$store.dispatch({
        type: "logout",
        user: this.user,
      });
      this.$router.push("/");
    },
  },
  computed: {
    isHeaderEnabled() {
      return (
        (this.$route.name === "home" && !this.user) ||
        this.$route.name === "login"
      );
    },
    headerClass() {
      return this.$route.name === "board" ? "board-page-style" : "";
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  components: {
    Avatar,
    menuModal,
    createBoard,
  },
};
</script>

<style></style>
