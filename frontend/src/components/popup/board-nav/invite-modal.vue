<template>
  <transition name="fade">
    <section class="invite-modal" v-if="users">
      <div class="invite-header flex">
        <h4>Invite to board</h4>
        <span @click="$emit('close')"></span>
      </div>
      <div class="content">
        <!-- <input class="full" type="text" placeholder="Invite to board"> -->
        <el-select
          class="full"
          v-model="value"
          multiple
          :filterable="true"
          :remote="true"
          reserve-keyword
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="user in options"
            :key="user._id"
            :label="user.fullname"
            :value="user.fullname"
          >
          </el-option>
        </el-select>
        <button class="full" :class="isInvited" @click="invite">
          Sent invitation
        </button>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    board: Object,
  },
  data() {
    return {
      users: [],
      options: [],
      value: [],
      loading: false,
    };
  },
  created() {
    this.loadUsers();
  },
  computed: {
    isInvited() {
      return this.value.length === 0 ? "no-invitations" : "";
    },
  },
  methods: {
    async loadUsers() {
      await this.$store.dispatch({ type: "getUsers" });
      this.users = JSON.parse(JSON.stringify(this.$store.getters.getUsers));
      this.users = this.users.filter(
        (currUser) =>
          !this.board.members.some((user) => user._id === currUser._id)
      );
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.users.filter((user) => {
            return user.fullname.toLowerCase().includes(query);
            // return user.fullname === query.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    invite() {
      const members = this.users.filter((user) => {
        return this.value.some((name) => name === user.fullname);
      });
      this.$emit("setMembers", members);
      this.$emit("close");
    },
  },
};
</script>

<style></style>
