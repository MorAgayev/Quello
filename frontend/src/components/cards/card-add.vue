<template>
  <section class="add-new-task flex">
    <span
      class="add-new-task-inner align-center full"
      v-if="!isFormCardOpen"
      @click="isFormCardOpen = !isFormCardOpen"
    >
      <span>Add a Card</span>
      <span class="add-new-task-inner-title"></span>
    </span>
    <div v-else class="new-card-form">
      <textarea
        name="add-card"
        cols="30"
        rows="10"
        placeholder="Enter a title for this card..."
        v-model="cardToEdit.title"
        spellcheck="false"
      ></textarea>
      <div class="add-card-control">
        <button @click="addCard">Add Card</button>
        <span
          class="add-card-close-icon"
          @click="isFormCardOpen = !isFormCardOpen"
        ></span>
      </div>
    </div>
  </section>
</template>

<script>
import { cardService } from "../../service/card.service.js";
import { userService } from "../../service/user.service";
export default {
  props: {
    columnId: {
      type: String,
    },
  },
  data() {
    return {
      isFormCardOpen: false,
      cardToEdit: cardService.createCard(),
    };
  },
  created() {},
  methods: {
    addCard() {
      this.isFormCardOpen = !this.isFormCardOpen;
      this.$emit("add", { card: this.cardToEdit, listId: this.columnId });
      this.cardToEdit = null;
    },
  },
  watch: {
    isFormCardOpen: {
      handler(mode) {
        this.cardToEdit = mode ? cardService.createCard() : null;
      },
    },
  },
};
</script>
