<template>
  <div class="board-menu-page" @click="$emit('close')">
    <section class="board-menu-container" @click.stop>
      <div class="menu-header align-center">
        <span
          v-if="contentToShow !== 'Menu'"
          @click="setContent('Menu')"
        ></span>
        <h4>{{ contentToShow }}</h4>
        <span @click="$emit('close')"></span>
      </div>
      <div class="board-menu-content">
        <div class="menu-content" v-if="contentToShow === 'Menu'">
          <ul class="menu-action-btns">
            <li class="about-board" @click="setContent('About')">
              <div class="title">
                <span class="trello-icon"></span>
                <span>About this board</span>
              </div>
              <p>Add description to your board</p>
            </li>
            <li @click="setContent('Background')">
              <span
                class="bg-icon"
                :style="{ backgroundColor: 'lightblue' }"
              ></span>
              <span>Change background</span>
            </li>
            <li @click="setContent('Search')">
              <span class="search-icon"></span>
              <span>Search</span>
            </li>
            <li @click="setContent('Archive')">
              <span class="archive-icon"></span>
              <span>Archive</span>
            </li>
          </ul>
          <div class="activity" v-if="activities">
            <div class="title">
              <span></span>
              <span>Activity</span>
            </div>
            <ul class="activity-list">
              <li
                v-for="(activity, idx) in activities"
                :key="'activity' + activity.id + idx"
                @click="goTo(activity)"
                :style="activityStyle(activity)"
              >
                <div class="align-center">
                  <avatar
                    class="avatar"
                    :size="32"
                    :username="activity.createdBy.fullname"
                    :src="activity.createdBy.imgUrl"
                  ></avatar>
                  <span v-if="activity.title"
                    ><span class="user-name">{{
                      activity.createdBy.fullname
                    }}</span>
                    {{ activity.title }}</span
                  >
                  <span v-else
                    ><span class="user-name">{{
                      activity.createdBy.fullname
                    }}</span>
                    {{ activity.title }}</span
                  >
                  <div class="controls">
                    <img
                      class="restore"
                      src="@/assets/imgs/restore-clock_48.png/"
                      v-if="activity.dispatch"
                      @click.stop="restore(activity)"
                      title="Restore"
                    />
                  </div>
                </div>
                <small>Add {{ activity.createdAt | moment("from") }}</small>
              </li>
            </ul>
          </div>
        </div>
        <component
          v-else
          :is="contentToShow"
          :board="board"
          @set="setBoard"
        ></component>
      </div>
    </section>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import Background from "./background-content.vue";
import Archive from "./archive.vue";

import { getLoggedinUser } from "../../../service/user.service";
import { cardService } from "../../../service/card.service";

export default {
  props: {
    board: Object,
  },
  data() {
    return {
      contentToShow: "Menu",
    };
  },
  created() {},
  methods: {
    async restore(activity) {
      await this.$store.dispatch({
        activityId: activity.id,
        ...activity.dispatch,
        createdAt: Date.now(),
      });
      if (activity.listId && activity.cardId) this.goTo(activity);
    },
    goTo(activity) {
      if (!activity.listId || !activity.cardId) return;
      this.$router.push({
        path: `${this.$route.path}?listId=${activity.listId}&cardId=${activity.cardId}`,
      });
    },
    activityStyle(activity) {
      return !activity.listId || !activity.cardId ? {} : { cursor: "pointer" };
    },
    setContent(val) {
      this.contentToShow = val;
    },
    setBoard({ key, item }) {
      this.$store.dispatch({ type: "setBoardItem", key, item });
    },
  },
  components: {
    Avatar,
    Archive,
    Background,
  },
  computed: {
    activities() {
      return this.board.activities
        .filter((activity) => {
          if (activity.title.includes("undefined")) return false;
          if (!activity.mentions || !activity.mentions.length)
            activity.mentions = cardService.getMentions(
              this.board,
              activity.listId,
              activity.cardId
            );
          return (
            activity.createdBy._id === getLoggedinUser()?._id ||
            !activity.mentions ||
            !activity.mentions.length ||
            activity.mentions.find(
              (user) => user._id === getLoggedinUser()?._id
            )
          );
        })
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 50);
    },
  },
};
</script>

<style></style>
