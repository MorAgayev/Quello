<template>
  <div class="due-date flex">
    <h4>DUE DATE</h4>
    <div class="new-date flex">
      <date-picker
        v-model="dueDate.date"
        value-type="timestamp"
        :type="format"
        :formatter="momentFormat"
        :open="true"
        :append-to-body="false"
        :clearable="false"
        :inline="true"
      >
      </date-picker>
    </div>
    <div class="due-date-btns flex">
      <button @click="set">Save</button>
      <button class="delete-btn" @click="remove" v-if="dueDate.date">
        Remove
      </button>
    </div>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
var moment = require("moment");
moment().format();

export default {
  name: "combo",
  props: {
    card: Object,
    action: Object,
  },
  data() {
    return {
      format: this.action?.format || "datetime",
      dueDate: {
        date: this.action.timestamp || this.card.dueDate?.date,
        isComplete: false,
        createdAt: Date.now(),
        completedAt: Date.now(),
      },
      momentFormat: {
        stringify: (date) => {
          return date ? moment(date).format(`MMM Do h:mm a`) : "";
        },
        parse: (value) => {
          return value ? moment(value, `MMM Do h:mm a`).toDate() : null;
        },
      },
    };
  },
  methods: {
    set() {
      if (this.dueDate.isComplete) this.dueDate.completedAt = Date.now();
      this.$emit("add", { key: "dueDate", item: this.dueDate });
      this.$emit("close");
    },
    remove() {
      this.$emit("add", {
        key: "dueDate",
        item: {
          date: null,
          isComplete: null,
          createdAt: null,
          completedAt: null,
        },
      });
      this.$emit("close");
    },
  },
  components: {
    DatePicker,
  },
};
</script>
