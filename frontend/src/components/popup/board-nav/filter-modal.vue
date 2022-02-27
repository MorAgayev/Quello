<template>
  <transition name="fade">
    <section class="filter-modal">
      <div class="filter-header flex">
        <h4>Filter</h4>
        <span @click="$emit('close')"></span>
      </div>
      <div class="content">
        <div class="search">
          <label>
            Keyword
            <input v-model="filterBy.keyword" class="full" type="text" />
          </label>
          <span>Search cards, members, labels and more.</span>
        </div>
        <div class="members">
          <label>Members</label>
          <ul>
            <li v-for="member in board.members" :key="member.id">
              <div>
                <input
                  type="checkbox"
                  @click="setMembers(member)"
                  :checked="isMemberSet(member)"
                />
                <avatar
                  class="avatar"
                  :size="24"
                  :username="member.fullname"
                  :src="member.imgUrl"
                ></avatar>
                {{ member.fullname }}
              </div>
            </li>
          </ul>
        </div>
        <div class="due-date">
          <label>Due date</label>
          <ul>
            <li>
              <input
                type="checkbox"
                @change="setDueDate(1)"
                :checked="filterBy.dueDate[0] === 1"
              />
              <span class="no-due-icon"></span>
              <span>No due date</span>
            </li>
            <li>
              <input
                type="checkbox"
                @change="setDueDate(2)"
                :checked="filterBy.dueDate[0] === 2"
              />
              <span class="over-due-icon"></span>
              <span>Over due</span>
            </li>
            <li>
              <input
                type="checkbox"
                @change="setDueDate(3)"
                :checked="filterBy.dueDate[0] === 3"
              />
              <span class="next-due-icon"></span>
              <span>Due in the next day</span>
            </li>
          </ul>
        </div>
        <div class="labels">
          <label>Labels</label>
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  @click="setLabel()"
                  :checked="isLabelsClean"
                />
                <span class="no-labels-icon"></span>
                <span>No labels</span>
              </label>
            </li>
            <li v-for="label in board.labels" :key="label.id">
              <label class="label-item">
                <input
                  type="checkbox"
                  @click="setLabel(label.id)"
                  :checked="isLabelChecked(label.id)"
                />
                <span class="label" :style="{ backgroundColor: label.color }">{{
                  label.title
                }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
import Avatar from "vue-avatar";
import { debounce } from "../../../service/util.service";
export default {
  props: {
    board: Object,
    filterBy: Object,
  },
  components: {
    Avatar,
  },
  methods: {
    setLabel(id) {
      const labelsIds = this.filterBy.labelsIds;
      const labelIdx = labelsIds.findIndex((labelId) => labelId === id);
      if (labelIdx < 0) labelsIds.push(id);
      else labelsIds.splice(labelIdx, 1);
    },
    isLabelChecked(id) {
      const labelsIds = this.filterBy.labelsIds;
      if (!id && !labelsIds.length) return true;
      else return labelsIds.includes(id);
    },
    setMembers(member) {
      const members = this.filterBy.members;
      const memberIdx = members.findIndex((id) => id === member._id);
      if (memberIdx < 0) members.push(member._id);
      else members.splice(memberIdx, 1);
    },
    isMemberSet(member) {
      const members = this.filterBy.members;
      return members.find((id) => id === member._id) ? true : false;
    },
    setDueDate(val) {
      const dueDate = this.filterBy.dueDate;
      if (dueDate[0] === val) dueDate.splice(0, 1, 0);
      else dueDate.splice(0, 1, val);
    },
  },
  computed: {
    isLabelsClean() {
      return !this.filterBy.labelsIds.length;
    },
  },
  watch: {
    filterBy: {
      handler(data) {
        debounce(() => this.$emit("filter", data));
      },
      deep: true,
    },
  },
};
</script>

<style></style>
