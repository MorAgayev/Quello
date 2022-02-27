<template>
  <section class="combo-list flex wrap">
    <div class="member flex" v-if="card.members.length">
      <h3>MEMBERS</h3>
      <div class="new-member">
        <article class="member-wrapper flex">
          <avatar
            v-for="member in card.members"
            :key="member._id"
            class="avatar"
            :size="32"
            :username="member.fullname"
            :src="member.imgUrl"
            :title="member.fullname"
          ></avatar>
          <button>
            <span
              class="icon"
              @click.stop="
                $emit('popup', {
                  type: 'Members',
                  offset: { x: 0, y: 0 },
                  target: $event.target,
                  position: 'fixed',
                })
              "
            ></span>
          </button>
        </article>
      </div>
    </div>
    <div class="label flex" v-if="getLabelFromIds.length">
      <h3>LABELS</h3>
      <div class="new-label flex wrap">
        <span
          class="label-name"
          v-for="(label, idx) in getLabelFromIds"
          :key="idx"
          :style="{ backgroundColor: label.color }"
          :title="label.title"
          >{{ label.title }}</span
        >
        <span
          class="add-label"
          @click.stop="
            $emit('popup', {
              type: 'Labels',
              offset: { x: 0, y: 0 },
              target: $event.target,
              position: 'fixed',
            })
          "
        ></span>
      </div>
    </div>
    <div class="due-date flex" v-if="card.dueDate.date">
      <h3>DUE DATE</h3>
      <div class="new-date flex">
        <span class="check-date">
          <svg
            @click="setIsComplete"
            v-if="card.dueDate.isComplete"
            class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium todo-check pointer css-vubbuv"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="CheckBoxIcon"
          >
            <path
              d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            ></path>
          </svg>
          <svg
            @click="setIsComplete"
            v-else
            class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium pointer css-vubbuv"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="CheckBoxOutlineBlankIcon"
          >
            <path
              d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
            ></path>
          </svg>
        </span>
        <div class="date-picker flex">
          <button
            class="date-picker-frame"
            @click="
              $emit('popup', {
                type: 'Dates',
                offset: { x: 0, y: 0 },
                target: $event.target,
                position: 'fixed',
                value: card,
              })
            "
          >
            <date-picker
              v-model="card.dueDate.date"
              value-type="timestamp"
              type="datetime"
              :formatter="momentFormat"
              input-class="date-picker-input"
              :clearable="false"
              disabled
            >
            </date-picker>
            <span class="iscomplete" v-show="card.dueDate.isComplete"
              >complete</span
            >
            <span class="arrow">
              <svg
                width="15"
                height="15"
                role="presentation"
                focusable="false"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { deepCopy } from "../../../service/util.service";
import Avatar from "vue-avatar";
var moment = require("moment");
moment().format();

export default {
  name: "combo",
  props: {
    card: Object,
  },
  data() {
    return {
      dueDate: null,
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
    setDueDate() {
      this.dueDate.createdAt = Date.now();
      this.$emit("set", { item: this.dueDate, key: "dueDate" });
    },
    setIsComplete() {
      this.dueDate.isComplete = !this.dueDate.isComplete;
      if (this.dueDate.isComplete) this.dueDate.completedAt = Date.now();
      this.setDueDate();
    },
  },
  computed: {
    getTime() {
      return moment(this.card.dueDate.date, "X").format("lll");
    },
    getLabelFromIds() {
      const boardLabels = this.$store.getters.boardLabels;
      return this.card.labelsIds
        .map((id) => boardLabels.find((label) => label.id === id))
        .filter((label) => !!label);
    },
  },
  watch: {
    "card.dueDate": {
      handler(data) {
        this.dueDate = deepCopy(data);
      },
      deep: true,
      immediate: true,
    },
  },
  components: {
    DatePicker,
    Avatar,
  },
};
</script>
