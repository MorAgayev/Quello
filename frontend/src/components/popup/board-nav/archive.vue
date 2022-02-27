<template>
  <section class="card-archive">
    <template v-for="(card, idx) in archiveData.cards">
      <card-preview
        :key="`ARCHIVE${idx}_${card.id}`"
        :card="card"
        :listId="archiveData.listId[card.id]"
        :isShown="isShowLabels"
        @setShown="isShowLabels = !isShowLabels"
        @click.native="
          $router.push({
            path: `${$route.path}?listId=${
              archiveData.listId[card.id]
            }&cardId=${card.id}`,
          })
        "
      />
    </template>
  </section>
</template>

<script>
import cardPreview from "../../cards/card-preview.vue";

export default {
  props: {
    board: Object,
  },
  components: {
    cardPreview,
  },
  data() {
    return {
      isShowLabels: false,
    };
  },
  created() {},
  methods: {},
  computed: {
    archiveData() {
      const data = {
        listId: {},
        cards: [],
      };
      const lists = this.board.lists;
      lists.forEach((list) =>
        list.cards.forEach((card) => {
          if (card.archiveAt) {
            data.cards.push(card);
            data.listId[card.id] = list.id;
          }
        })
      );
      data.cards = data.cards.sort((a, b) => b.archiveAt - a.archiveAt);
      return data;
    },
  },
  watch: {},
};
</script>

<style></style>
