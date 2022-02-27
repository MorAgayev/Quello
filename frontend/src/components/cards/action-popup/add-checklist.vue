<template>
  <section class="checklist">
    <label>
      Title
      <input
        class="txt-input full"
        v-model="checklist.title"
        type="text"
        placeholder="Checklist"
      />
    </label>
    <button @click="add">Add</button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      checklist: {
        title: "",
        items: [],
      },
    };
  },
  methods: {
    add() {
      this.$emit("add", { key: "checkList", item: this.checklist });
      this.$emit("close");
    },
  },
};
</script>

<style></style>
