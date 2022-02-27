<template>
  <div class="member" v-if="action">
    <div class="users-select">
      <h3>Members</h3>
      <input
        type="text"
        class="txt-input full"
        v-model="search"
        placeholder="Search members"
        ref="search"
      />
      <ul>
        <li
          v-for="(member, idx) in members"
          :key="member._id + idx"
          @click="add(member)"
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
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Mentionable } from "vue-mention";
import Avatar from "vue-avatar";

export default {
  components: {
    Mentionable,
    Avatar,
  },
  props: {
    action: Object,
    card: Object,
  },
  created() {},
  mounted() {
    this.$refs.search.focus();
  },
  data() {
    return {
      search: this.action.mention ? this.action.mention.substr(1) : "",
    };
  },

  methods: {
    add(member) {
      this.$emit("add", member);
      this.$emit("close");
    },
  },
  computed: {
    members() {
      //   if (!this.action.search) return this.action.memberInCard;
      const search = this.search;
      return this.action.memberInCard.filter((member) => {
        return (
          member.fullname.toLowerCase().includes(search.toLowerCase()) ||
          member.username.toLowerCase().includes(search.toLowerCase())
        );
      });
    },
  },
};
</script>
