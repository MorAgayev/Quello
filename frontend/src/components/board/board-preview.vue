<template>
  <section
    @mouseover="show = true"
    @mouseleave="show = false"
    class="board-card"
    @click="showBoard"
    style="height: 100%"
  >
    <img
      v-if="board.style.backgroundThumb || board.style.backgroundImage"
      :src="imgSrc"
    />
    <div
      v-else
      class="board-background"
      :style="{ background: board.style.backgroundColor }"
    ></div>
    <p class="board-title">
      {{ board.title }}
    </p>
    <transition name="slide-fade">
      <span
        v-if="!board.isFavorite"
        class="unstar"
        @click.stop="toggleStar"
      ></span>
      <span v-else class="star" @click.stop="toggleStar"></span>
    </transition>
  </section>
</template>
<script>
export default {
  props: {
    board: {
      type: Object,
    },
  },
  data() {
    return {
      show: true,
      copyBoard: this.board,
    };
  },
  methods: {
    showBoard() {
      this.$router.push(`/board/${this.board._id}`);
    },
    async toggleStar() {
      await this.$store.dispatch({
        type: "setBoardItem",
        key: "isFavorite",
        item: !this.board.isFavorite,
        boardId: this.board._id,
      });
      this.$emit("change", {
        ...this.board,
        isFavorite: !this.board.isFavorite,
      });
    },
  },
  computed: {
    imgSrc() {
      const image =
        this.board.style.backgroundThumb || this.board.style.backgroundImage;
      return /(\burl\()(.*?)(?=\))/gm.exec(image)[0].slice(4);
      // return image.slice(4, image.length - 1);
    },
  },
};
</script>

<style></style>
