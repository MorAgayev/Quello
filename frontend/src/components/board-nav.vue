<template>
  <section class="board-nav align-center full">
    <div class="menu-left-btns">
      <div
        class="board-modal-btn btn"
        @click="toggleBoardModal"
        :style="darkStyle"
      >
        <span></span>
        <span>Board</span>
        <span></span>
      </div>
      <board-modal
        v-if="isBoardModal"
        @toggleDashboard="toggleDashboard"
      ></board-modal>
      <div class="title" :style="darkStyle">
        <input
          :size="title.length"
          v-model="title"
          class="board-title"
          @change="dispatchSetItem({ item: title, key: 'title' })"
        />
      </div>
      <div class="star btn" :style="{ darkStyle }" @click="toggleStar">
        <span :class="{ unstar: board.isFavorite }"></span>
      </div>
    </div>
    <div class="menu-members-btns align-center">
      <div class="avatar-list flex" v-if="board.members.length">
        <avatar
          v-for="(member, idx) in board.members"
          :key="member._id + idx"
          class="avatar"
          :size="28"
          :username="member.fullname"
          :src="member.imgUrl"
        ></avatar>
      </div>
      <div class="invite-btn btn" @click="toggleInviteModal" :style="darkStyle">
        <span></span>
        <span>Invite</span>
      </div>
      <invite-modal
        v-if="isInvite"
        @setMembers="setMembers"
        @close="toggleInviteModal"
        :board="board"
      ></invite-modal>
    </div>
    <div class="menu-right-btns">
      <div class="filter-btn btn" @click="toggleFilterModal" :style="darkStyle">
        <span></span>
        <span>Filter</span>
      </div>
      <filter-modal
        v-if="isFilter"
        :board="board"
        :filterBy="filter"
        @close="toggleFilterModal"
      ></filter-modal>
      <div class="board-menu btn" @click="toggleMenuModal" :style="darkStyle">
        <span></span>
        <span>Show menu</span>
      </div>
      <menu-modal
        v-if="isMenuModal"
        :board="board"
        @close="toggleMenuModal"
      ></menu-modal>
    </div>
  </section>
</template>

<script>
import Avatar from "vue-avatar";
import boardModal from "../components/popup/board-nav/board-modal.vue";
import inviteModal from "../components/popup/board-nav/invite-modal.vue";
import filterModal from "../components/popup/board-nav/filter-modal.vue";
import menuModal from "../components/popup/board-nav/menu-modal.vue";
export default {
  props: {
    board: Object,
    filter: Object,
  },
  data() {
    return {
      title: this.board.title,
      isBoardModal: false,
      isInvite: false,
      isFilter: false,
      isMenuModal: false,
    };
  },
  methods: {
    async dispatchSetItem({ key, item }) {
      this.$store.dispatch({ type: "setBoardItem", key, item });
    },
    toggleDashboard() {
      this.$emit("toggleDashboard");
      this.toggleBoardModal();
    },
    toggleBoardModal() {
      this.isBoardModal = !this.isBoardModal;
    },
    toggleInviteModal() {
      this.isInvite = !this.isInvite;
    },
    toggleFilterModal() {
      this.isFilter = !this.isFilter;
    },
    toggleMenuModal() {
      this.isMenuModal = !this.isMenuModal;
    },
    toggleStar() {
      this.$store.dispatch({
        type: "setBoardItem",
        key: "isFavorite",
        item: !this.board.isFavorite,
        boardId: this.board._id,
      });
    },
    setMembers(members) {
      this.board.members.push(...members);
      this.$store.dispatch({ type: "updateBoard", board: this.board });
    },
  },
  computed: {
    darkStyle() {
      return this.board.style.isDark
        ? { filter: "invert(1)", color: "black" }
        : {};
    },
  },
  components: {
    Avatar,
    boardModal,
    inviteModal,
    filterModal,
    menuModal,
  },
};
</script>

<style></style>
