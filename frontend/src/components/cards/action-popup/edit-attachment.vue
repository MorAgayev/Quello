<template>
  <section class="actions-cmp">
    <div class="header flex">
      <h4>Edit attachment</h4>
      <span @click="$emit('close')"></span>
    </div>
    <div class="edit-attachment">
      <label>
        Link name
        <input type="text" v-model="title" />
      </label>
      <button @click="updateTitle">Update</button>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    attachment: {
      type: Object,
    },
  },
  data() {
    return {
      title: this.attachment.fileName,
    };
  },
  methods: {
    updateTitle() {
      this.$emit("updateTitle", { ...this.attachment, fileName: this.title });
    },
  },
};
</script>

<style></style>
