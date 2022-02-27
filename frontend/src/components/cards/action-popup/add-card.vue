<template>
  <div class="add-card-action">
    <div class="title">
      Title:
      <textarea v-model="title"></textarea>
    </div>
    <div class="keep">
      Keep:
      <label v-if="card.labelsIds.length"
        ><input type="checkbox" v-model="keep.labelsIds" />Labels ({{
          card.labelsIds.length
        }})</label
      >
      <label v-if="card.members.length"
        ><input type="checkbox" v-model="keep.members" />Members ({{
          card.members.length
        }})</label
      >
      <label v-if="card.dueDate.date"
        ><input type="checkbox" v-model="keep.dueDate" />Due Date</label
      >
      <label v-if="card.attachments.length"
        ><input type="checkbox" v-model="keep.attachments" />Attachments ({{
          card.attachments.length
        }})</label
      >
      <label v-if="card.checkList.length"
        ><input type="checkbox" v-model="keep.checkList" />Checklist ({{
          card.checkList.length
        }})</label
      >
      <label v-if="card.location"
        ><input type="checkbox" v-model="keep.location" />Location</label
      >
    </div>
    <div class="control">
      <div class="title">{{ action.type }} to:</div>
      <div class="position">
        <select v-model="selected">
          <option v-for="(list, id) in lists" :value="id" :key="id">
            {{ list }}
          </option>
        </select>
      </div>
      <button @click="save">{{ action.type }}</button>
    </div>
  </div>
</template>

<script>
import { deepCopy } from "../../../service/util.service";
export default {
  name: "card-action",
  props: {
    card: Object,
    board: Object,
    action: Object,
  },
  data() {
    return {
      selected: null,
      title: this.card.title,
      keep: {
        labelsIds: true,
        members: true,
        attachments: true,
        location: true,
        checkList: true,
        dueDate: true,
      },
    };
  },
  created() {},
  methods: {
    save() {
      if (!this.selected) return;
      const card = deepCopy(this.card);
      const listId = this.selected;
      switch (this.action.type.toLowerCase()) {
        case "copy":
          delete card.id;
          card.title = this.title;
          if (!this.keep.labelsIds) card.labelsIds = [];
          if (!this.keep.members) card.members = [];
          if (!this.keep.attachments) card.attachments = [];
          if (!this.keep.location) card.location = null;
          if (!this.keep.checkList) card.checkList = [];
          if (!this.keep.dueDate)
            card.dueDate = {
              date: null,
              isComplete: null,
              createdAt: null,
              completedAt: null,
            };
          this.$emit(this.action.type.toLowerCase(), { card, listId });
          break;
        case "move":
          this.$emit(this.action.type.toLowerCase(), { card, listId });
          break;
      }
      this.$emit("close");
    },
  },
  computed: {
    lists() {
      const lists = {};
      this.board.lists.forEach(
        (list, idx) => (lists[list.id] = `${idx}: ${list.title}`)
      );
      return lists;
    },
    listId() {
      const res = this.board.lists.find((list) =>
        list.cards.find((card) => card.id === this.card.id)
      )?.id;
      console.log(res);
      return res;
    },
  },
};
</script>
