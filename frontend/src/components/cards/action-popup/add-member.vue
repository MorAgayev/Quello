<template>
  <section class="member">
    <input
      type="text"
      v-model="searchVal"
      class="txt-input full"
      placeholder="Search members"
    />
    <label> Board members </label>
    <ul v-if="board">
      <li
        v-for="(member, idx) in memberToShow"
        :key="member._id + idx"
        @click="toggleMember(member)"
      >
        <div class="member-list">
          <avatar
            class="avatar"
            :size="32"
            :username="member.fullname"
            :src="member.imgUrl"
          ></avatar>
          <span>{{ member.fullname }} </span>
          <span>({{ member.username }})</span>
          <span v-if="isMember(member._id)" class="is-member"></span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import Avatar from "vue-avatar";
import { deepCopy } from "../../../service/util.service";
export default {
  props: {
    card: Object,
    board: Object,
    action: Object,
  },
  data() {
    return {
      searchVal: "",
      members: deepCopy(
        this.action.members || this.card.members || this.board.members
      ),
    };
  },
  created() {
    console.log(this.action);
  },
  methods: {
    toggleMember(member) {
      if (this.members.some((currMember) => currMember._id === member._id)) {
        this.members = this.members.filter(
          (currMember) => currMember._id != member._id
        );
      } else if (
        (!this.action.limit || this.members.length < this.action.limit) &&
        !this.members.includes(member)
      )
        this.members.push(member);
      else if (this.action.limit === 1) {
        this.members.splice(0, 1, member);
      }
      this.$emit("add", { item: this.members, key: "members" });
      if (this.action.limit && this.members.length === this.action.limit)
        this.$emit("close");
    },
    isMember(memberId) {
      return this.members.find((currMember) => currMember._id === memberId);
    },
  },
  computed: {
    memberToShow() {
      return this.board.members.filter((member) => {
        return (
          member.fullname
            .toLowerCase()
            .includes(this.searchVal.toLowerCase()) ||
          member.username.toLowerCase().includes(this.searchVal.toLowerCase())
        );
      });
    },
  },
  components: {
    Avatar,
  },
};
</script>

<style></style>
