<template>
  <div class="badge">
    <div class="badge-icons">
      <span class="watch" :style="fullCoverColorStyle" v-if="getWatch"> </span>
      <div
        class="due-date"
        v-if="card.dueDate.date"
        @mouseover="isDateHover = true"
        @mouseleave="isDateHover = false"
        :class="{
          complete: card.dueDate.isComplete,
          'bgc-check': !card.dueDate.isComplete && isDateHover,
          'warning-incomplete':
            !card.dueDate.isComplete &&
            !isDateHover &&
            card.dueDate.date < Date.now(),
        }"
        :style="
          !card.dueDate.isComplete && !isDateHover
            ? { ...fullCoverColorStyle }
            : {}
        "
      >
        <span
          class="due-date-icon"
          v-if="!isDateHover"
          :class="{ 'fill-icon': card.dueDate.isComplete }"
          :style="
            fullCoverColorStyle.filter &&
            !isDateHover &&
            !card.dueDate.isComplete &&
            !card.dueDate.date < Date.now()
              ? { color: 'black' }
              : {}
          "
        ></span>
        <div class="toggle-date" v-if="isDateHover">
          <span
            class="checked"
            v-if="card.dueDate.isComplete"
            :class="{ 'fill-icon': card.dueDate.isComplete }"
            :style="
              fullCoverColorStyle && !isDateHover ? { color: 'black' } : {}
            "
            @click.stop="toggleDueDate(false, card.dueDate)"
          ></span>
          <span
            class="check"
            v-else
            @click.stop="toggleDueDate(true, card.dueDate)"
            :style="
              fullCoverColorStyle && !isDateHover ? { color: 'black' } : {}
            "
          ></span>
        </div>
        {{ getDueDate }}
      </div>

      <span
        class="description"
        :style="fullCoverColorStyle"
        v-if="card.desc"
      ></span>

      <span
        class="attachments"
        :style="fullCoverColorStyle"
        v-if="card.attachments && card.attachments.length"
        >{{ getCountAttachments }}
      </span>

      <span
        class="checkList"
        :style="fullCoverColorStyle"
        v-if="card.checkList && card.checkList.length"
      >
        {{ getCountCheckList }}</span
      >

      <span class="location" v-if="card.location" :style="fullCoverColorStyle">
        {{ getDistance }}
      </span>

      <svg
        v-if="getVideoAttached"
        :style="{ ...fullCoverColorStyle }"
        class="video"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="video"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        data-fa-i2svg=""
      >
        <path
          d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z"
        ></path>
      </svg>
    </div>
    <div class="members-preview flex">
      <template v-for="member in card.members">
        <avatar
          v-if="member"
          :key="member._id"
          class="avatar-comment"
          :size="30"
          :username="member.username"
          :src="member.imgUrl"
        ></avatar>
      </template>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import { userService } from "../../service/user.service";
import { deepCopy, getDistanceInKm } from "../../service/util.service";

var moment = require("moment");
moment().format();
export default {
  props: {
    card: Object,
    fullCoverColorStyle: Object,
  },
  components: {
    Avatar,
  },
  data() {
    return {
      isDateHover: false,
      distance: "",
    };
  },
  async created() {
    const distance = await getDistanceInKm(this.card.location);
    this.distance = distance ? distance : "";
  },
  methods: {
    toggleDueDate(isChecked, dueDate) {
      dueDate = deepCopy(dueDate);
      dueDate.isComplete = isChecked;
      this.$emit("set", { item: dueDate, key: "dueDate" });
      //   this.setItem(dueDate, "dueDate");
    },
  },
  computed: {
    getVideoAttached() {
      return /(\<{2})\byoutube:((?!<|>).*?)(?=\>{2})/.test(this.card.desc);
    },
    getCountCheckList() {
      let sum = this.card.checkList.reduce(
        (sum, list) => {
          const todoSum = list.items.reduce(
            (sum, todo) => {
              return {
                total: sum.total + 1,
                complete: todo.isDone ? sum.complete + 1 : sum.complete,
              };
            },
            { total: 0, complete: 0 }
          );
          return {
            total: sum.total + todoSum.total,
            complete: sum.complete + todoSum.complete,
          };
        },
        { total: 0, complete: 0 }
      );
      return sum.complete + "/" + sum.total;
    },
    getCountAttachments() {
      return this.card.attachments && this.card.attachments.length;
    },
    getDueDate() {
      if (this.card.dueDate) {
        const formatter = moment(this.card.dueDate.date).format("ll");
        return moment(this.card.dueDate.date)
          .format("ll")
          .slice(0, formatter.indexOf(","));
      } else return;
    },
    getWatch() {
      const { _id: id } = userService.getLoggedinUser();
      return !!this.card.members.find((user) => user._id === id);
    },
    getDistance() {
      if (!this.distance) return "";
      return (
        this.distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "km"
      );
    },
  },
};
</script>
