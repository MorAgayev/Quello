<template>
  <div>
    <section class="dimm-background" @click.stop="$emit('close')" />

    <div class="quick-edit" @click.stop :style="modalStyle" ref="quickEdit">
      <div class="btns">
        <p class="btn-open" @click.stop="openCard"><span>Open card</span></p>
        <p
          class="btn-labels"
          @click.stop="
            $emit('action', {
              type: 'Labels',
              target: $event.target.parentElement.parentElement,
              position: 'fixed',
            })
          "
        >
          <span>Edit labels</span>
        </p>
        <p
          class="btn-members"
          @click.stop="
            $emit('action', {
              type: 'Members',
              target: $event.target.parentElement.parentElement,
              position: 'fixed',
            })
          "
        >
          <span>Change members</span>
        </p>
        <p
          class="btn-cover"
          @click.stop="
            $emit('action', {
              type: 'Cover',
              target: $event.target.parentElement.parentElement,
              position: 'fixed',
            })
          "
        >
          <span>Change cover</span>
        </p>
        <p
          class="btn-copy"
          @click.stop="
            $emit('action', {
              type: 'Copy',
              target: $event.target.parentElement.parentElement,
              position: 'fixed',
            })
          "
        >
          <span>Copy</span>
        </p>
        <p
          class="btn-duedate"
          @click.stop="
            $emit('action', {
              type: 'Dates',
              target: $event.target.parentElement.parentElement,
              position: 'fixed',
            })
          "
        >
          <span>Edit dates</span>
        </p>
        <p
          class="btn-archive"
          @click.stop="
            $emit('action', {
              type: 'Archive',
              target: $event.target.parentElement.parentElement,
              position: 'fixed',
            })
          "
        >
          <span>Archive</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: Object,
    card: Object,
    listId: String,
  },
  methods: {
    openCard() {
      this.$router.push({
        path: `${this.$route.path}?listId=${this.listId}&cardId=${this.card.id}`,
      });
      this.isEditMode = false;
    },
  },
  computed: {
    modalStyle() {
      return {
        top: this.config.top + "px",
        left: this.config.left + "px",
      };
    },
  },
};
</script>
