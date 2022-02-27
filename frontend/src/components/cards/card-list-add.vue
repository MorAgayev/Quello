<template>
  <section class="add-new-list" :style="isListForm">
    <div
      class="center flex align-center"
      v-if="!isListFormOpen"
      @click="addToggle"
    >
      <span class="icon"></span>
      Add a list
    </div>
    <div
      v-else
      class="list-form"
      :class="{ 'add-list-active': isListFormOpen }"
    >
      <input
        type="text"
        class="input-form"
        v-model="listToEdit.title"
        placeholder="Add a list"
        ref="title"
        @keydown.esc="addToggle"
      />
      <div class="add-card-control">
        <button @click="setList">Add List</button>
        <span class="icon" @click="addToggle"></span>
      </div>
    </div>
  </section>
</template>

<script>
import { cardService } from "../../service/card.service";
export default {
  props: {
    board: Object,
  },
  data() {
    return {
      isListFormOpen: false,
      listToEdit: cardService.createList(),
    };
  },
  methods: {
    setList() {
      this.isListFormOpen = !this.isListFormOpen;
      this.$emit("add", this.listToEdit);
      this.listToEdit = null;
    },
    addToggle() {
      this.isListFormOpen = !this.isListFormOpen;
    },
  },
  watch: {
    isListFormOpen: {
      handler(mode) {
        this.listToEdit = mode ? cardService.createList() : null;
      },
    },
  },
  computed: {
    isListForm() {
      return this.isListFormOpen
        ? { background: "#ebecf0" }
        : this.board.style.isDark
        ? { filter: "invert(1)", color: "black" }
        : {};
    },
  },
};
</script>
