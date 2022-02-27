<template>
  <section
    class="create-board"
    @keydown.esc="$emit('close')"
    @click.self="$emit('close')"
  >
    <div class="contant">
      <div class="top">
        <div
          class="title"
          :style="{
            background: style.backgroundImage || style.backgroundColor,
          }"
        >
          <input
            type="text"
            placeholder="Add board title"
            v-model="title"
            :style="darkStyle"
            required
          />
        </div>
        <div class="select-bg">
          <div class="bg-list" v-for="color in colors" :key="color">
            <button
              :style="{ background: color }"
              @click="setColorBackground(color)"
              class="bg-"
            ></button>
          </div>
        </div>
      </div>
      <button class="create-btn" @click="createBoard">Create board</button>
    </div>
  </section>
</template>

<script>
import { isHexColorLight } from "../../service/util.service";
import colorsPattern from "../../assets/json/colors.json";

export default {
  data() {
    return {
      title: "",
      style: { type: "color", backgroundColor: "#b3bac5", isDark: false },
      colors: colorsPattern.slice(0, 8),
    };
  },
  methods: {
    async createBoard() {
      if (this.title)
        try {
          const boardId = await this.$store.dispatch({
            type: "createBoard",
            title: this.title,
            style: this.style,
          });
          this.$router.push(`/board/${boardId}`);
          this.$emit("close");
        } catch (err) {
          console.log(err);
        }
    },
    setColorBackground(color) {
      this.style = {
        type: "color",
        backgroundColor: color,
        isDark: !isHexColorLight(color),
      };
    },
  },
  computed: {
    darkStyle() {
      return this.style.isDark
        ? { filter: "invert(1)", color: "black" }
        : { color: "#172b4d" };
    },
  },
};
</script>

<style></style>
