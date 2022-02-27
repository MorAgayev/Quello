<template>
  <main class="main-layout" v-if="boardToShow">
    <section class="boards-page">
      <h2>Workspace</h2>
      <div class="filter-section align-center">
        <select v-model="sortBy">
          <option v-for="value in options" :key="value">{{ value }}</option>
        </select>
        <input type="text" placeholder="Search board" v-model="searchVal" />
      </div>
      <template v-if="boardToShow.demo && boardToShow.demo.length">
        <h3 class="board-list-title">Demo boards</h3>
        <ul class="board-list grid" v-if="boards">
          <template class="grid" v-for="board in boardToShow.demo">
            <li v-if="!board.isStar" :key="'D' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
        <p class="warning">
          Automatically restores after idle for a few minutes
        </p>
      </template>
      <template v-if="boardToShow.star && boardToShow.star.length">
        <h3 class="board-list-title">Starred boards</h3>
        <ul class="board-star grid" v-if="boardToShow">
          <template class="grid" v-for="board in boardToShow.star">
            <li :key="'S' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
      </template>
      <template v-if="boardToShow.recent && boardToShow.recent.length">
        <h3 class="board-list-title">Recently active</h3>
        <ul class="board-list grid" v-if="boardToShow">
          <template class="grid" v-for="board in boardToShow.recent">
            <li v-if="!board.isStar" :key="'R' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
      </template>
      <template v-if="boardToShow.other && boardToShow.other.length">
        <h3 class="board-list-title">Other boards</h3>
        <ul class="board-list grid" v-if="boardToShow">
          <template class="grid" v-for="board in boardToShow.other">
            <li v-if="!board.isStar" :key="'O' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
      </template>
    </section>
  </main>
</template>

<script>
import boardPreview from "../components/board/board-preview.vue";
import { deepCopy } from "../service/util.service";
export default {
  data() {
    return {
      isGuest: this.$store.getters.loggedinUser?.username === "Guest",
      boards: null,
      options: [
        "Most recently active",
        "Latest recently active",
        "Alphabetically A-Z",
        "Alphabetically Z-A",
      ],
      sortBy: "Most recently active",
      searchVal: "",
    };
  },
  async created() {
    this.boards = await this.loadBoards();
  },
  methods: {
    async loadBoards() {
      return await this.$store.dispatch({ type: "loadBoards" });
    },
    toggleStar(changed) {
      const idx = this.boards.findIndex((board) => board._id === changed._id);
      console.log(idx);
      if (idx > -1) this.boards.splice(idx, 1, deepCopy(changed));
    },
  },
  computed: {
    boardToShow() {
      if (!this.boards) return null;
      const active = this.boards
        .sort((a, b) => b.activityCount - a.activityCount)
        .slice(0, 4);
      const recent = this.boards
        .sort((a, b) => b.lastActivity - a.lastActivity)
        .slice(0, 4);
      const star = this.boards.filter((board) => board.isFavorite);
      const other = this.boards.filter(
        (board) => !star.find((star) => star === board)
      );
      const demo = this.isGuest
        ? this.boards.filter((board) => board.isDemoBoard)
        : [];
      const boards = { demo, star, active, recent, other };
      for (const key in boards) {
        switch (this.sortBy) {
          case "Most recently active":
            boards[key] = boards[key].sort(
              (a, b) => b.activityCount - a.activityCount
            );
            break;
          case "Latest recently active":
            boards[key] = boards[key].sort(
              (a, b) => b.lastActivity - a.lastActivity
            );
            break;
          case "Alphabetically A-Z":
            boards[key] = boards[key].sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
            );
            break;
          case "Alphabetically Z-A":
            boards[key] = boards[key].sort((a, b) =>
              a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1
            );
            break;
        }
        if (this.searchVal)
          boards[key] = boards[key].filter((board) =>
            board.title.toLowerCase().includes(this.searchVal.toLowerCase())
          );
      }
      return boards;
    },
  },
  components: {
    boardPreview,
  },
};
</script>

<style></style>
