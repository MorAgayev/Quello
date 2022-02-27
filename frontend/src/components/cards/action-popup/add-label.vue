<template>
  <section class="label">
    <span class="back" v-if="labelOnEdit" @click="labelOnEdit = null"></span>
    <span class="input-title" v-if="labelOnEdit">Name</span>
    <input
      type="text"
      v-model="labelTitle"
      class="txt-input full"
      :placeholder="placeHolderTxt"
    />
    <label> {{ labelOnEdit ? "Select a color" : "Label" }}</label>

    <ul v-if="labels && !labelOnEdit">
      <li class="labels-list flex" v-for="label in labels" :key="label.id">
        <div
          class="hover"
          :style="{
            backgroundColor: label.color,
            color: '#ffffff',
          }"
        />
        <div
          class="label-item flex align-center"
          :style="{
            backgroundColor: label.color,
            color: '#ffffff',
          }"
          @click="toggleLabel(label.id)"
        >
          <span class="">{{ label.title }}</span>
          <span v-if="isCardLabel(label.id)" class="is-card-label"></span>
        </div>
        <span class="edit-label-icon" @click.stop="setLabelEdit(label)"></span>
      </li>
    </ul>
    <div class="custom-labels-editor flex" v-else>
      <div>
        <span
          v-for="(color, idx) in colors"
          :key="'C-' + idx"
          :style="{
            backgroundColor: color,
            color: '#ffffff',
          }"
          class="custom-label"
          @click="labelOnEdit.color = color"
        >
          <span
            v-if="labelOnEdit.color === color"
            class="select-custom-label"
          ></span>
        </span>
      </div>
      <div class="custom-label-btns flex">
        <button
          class="custom-label-btn-save"
          @click="setLabel({ item: labels, key: 'labels' })"
        >
          Save
        </button>
        <button class="custom-label-btn-delete" @click="removeLabel()">
          Delete
        </button>
      </div>
    </div>
    <button class="add-new-label" @click="addLabel" v-if="!labelOnEdit">
      Create a new label
    </button>
  </section>
</template>

<script>
import { deepCopy, makeId } from "../../../service/util.service";
import colorPattern from "../../../assets/json/colors.json";
export default {
  props: {
    card: Object,
  },
  data() {
    return {
      cardLabels: this.card.labelsIds,
      labelTitle: "",
      labelOnEdit: null,
      labels: deepCopy(this.$store.getters.boardLabels),
      placeHolderTxt: this.labelOnEdit ? "" : "Search labels...",
      colors: colorPattern.slice(0, 10),
    };
  },

  methods: {
    async setLabel({ key, item }) {
      this.labelOnEdit.title = this.labelTitle;
      const labelIdx = this.labels.findIndex(
        (label) => label.id === this.labelOnEdit.id
      );
      if (labelIdx > -1) {
        if (
          JSON.stringify(this.labelOnEdit) ===
          JSON.stringify(this.labels[labelIdx])
        ) {
          this.labelOnEdit = null;
          this.labelTitle = "";
          return;
        }
        this.labels.splice(labelIdx, 1, this.labelOnEdit);
      } else this.labels.push(this.labelOnEdit);
      this.$store.dispatch({ type: "setBoardItem", key, item });
      this.labelOnEdit = null;
      this.labelTitle = "";
    },
    async removeLabel() {
      const labelIdx = this.labels.findIndex(
        (label) => label.id === this.labelOnEdit.id
      );
      this.labels.splice(labelIdx, 1);
      this.$store.dispatch({
        type: "setBoardItem",
        key: "labels",
        item: this.labels,
      });
      this.labelOnEdit = null;
      this.labelTitle = "";
    },
    addLabel() {
      const colors = this.colors.filter(
        (color) => !this.labels.find((label) => label.color === color)
      );
      this.labelOnEdit = {
        id: makeId(),
        color: colors.length ? colors[0] : "",
        title: "",
      };
    },
    setLabelEdit(label) {
      this.labelOnEdit = deepCopy(label);
      this.labelTitle = label.title;
    },
    toggleLabel(labelId) {
      const labelIdx = this.cardLabels.findIndex((id) => id === labelId);
      if (labelIdx > -1) this.cardLabels.splice(labelIdx, 1);
      else this.cardLabels.push(labelId);
      this.cardLabels = this.cardLabels.filter((id) =>
        this.labels.find((label) => label.id === id)
      );
      this.$emit("add", { key: "labelsIds", item: this.cardLabels });
    },
    isCardLabel(labelId) {
      return this.cardLabels.find((id) => id === labelId);
    },
  },
  computed: {
    getLabels() {
      return this.$store.getters.boardLabels;
    },
  },
};
</script>

<style></style>
