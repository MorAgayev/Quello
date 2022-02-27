<template>
  <div class="activity-container">
    <action-cmp
      v-if="action"
      @set="setByPop"
      @close="action = null"
      :action="action"
      :card="card"
    ></action-cmp>

    <div class="title flex">
      <div class="left-side flex">
        <span class="activity-icon"></span>
        <h3 class="card-item-title">Activity</h3>
      </div>
      <button class="show-details" @click="isActiveOpen = !isActiveOpen">
        {{ openDetailsTitle }}
      </button>
    </div>

    <div class="active-box flex">
      <avatar
        class="avatar"
        :size="32"
        :username="logInUser.username"
        :src="logInUser.imgUrl"
      ></avatar>
      <div class="text-box flex" :class="{ 'text-box-active': isOpen }">
        <textarea
          cols="30"
          rows="10"
          placeholder="Write a comment..."
          @click="isOpen = comment.title.length ? true : !isOpen"
          v-model="comment.title"
          @input="setMentionToEdit"
          @blur="comment.title.length > 0 ? (isOpen = true) : (isOpen = false)"
        ></textarea>
        <div
          class="save-btn"
          v-if="isOpen"
          :class="{ 'show-save-btn': isOpen }"
        >
          <button
            @click="addActivity"
            :style="{
              backgroundColor: comment.title.length ? '#0079bf' : '',
              color: comment.title.length ? '#fff' : '',
              cursor: comment.title.length ? 'pointer' : 'not-allowed',
            }"
          >
            Save
          </button>
        </div>
        <div class="icons" v-if="isOpen" :class="{ 'icon-open': isOpen }">
          <span class="attachment" @click="addAttachment"></span>
          <span class="member"></span>
          <span class="emoji"></span>
        </div>
      </div>
    </div>

    <template
      v-for="(activity, idx) in board.activities.filter(
        (activity) => activity.cardId === this.card.id
      )"
    >
      <div
        class="active-comment flex"
        v-if="activity.type === 'comment'"
        :class="{
          'active-comment-space': isActivityId === activity.id,
        }"
        :key="idx"
      >
        <avatar
          class="avatar-comment"
          :size="32"
          :username="activity.createdBy.username"
          :src="activity.createdBy.imgUrl"
          v-if="activity.createdBy.username"
        ></avatar>
        <div class="active-input flex">
          <span class="active-username">{{ activity.createdBy.username }}</span>
          <span class="active-date"
            >Add {{ activity.createdAt | moment("from") }}</span
          >
          <div
            class="active-textarea"
            :class="{ 'open-active': isActivityId === activity.id }"
          >
            <template v-if="isActivityId === activity.id">
              <textarea
                cols="30"
                rows="10"
                placeholder="Write a comment..."
                v-model="activity.title"
                @input="setMentionToEdit($event, activity)"
                @blur="tempActivity = activity"
              ></textarea>
              <div
                :class="{
                  'active-show-save-btn':
                    !isEditOpen && isActivityId === activity.id,
                }"
                class="active-btn-save flex"
              >
                <button
                  @click="updateActivity(activity)"
                  :style="{
                    backgroundColor: activity.title.length ? '#0079bf' : '',
                    color: activity.title.length ? '#fff' : '',
                    cursor: activity.title.length ? 'pointer' : 'not-allowed',
                  }"
                >
                  Save
                </button>
                <span class="close-input" @click="closeEditMode"></span>
              </div>
            </template>
            <div
              v-else
              class="text-area"
              v-html="commentToHtml(activity.title)"
            />
            <div class="icons">
              <span class="attachment" @click="addAttachment"></span>
              <span class="member"></span>
              <span class="emoji"></span>
            </div>
          </div>
          <div
            class="active-control-btn"
            v-if="
              logInUser._id === activity.createdBy._id &&
              isActivityId !== activity.id
            "
          >
            <span @click="isActivityId = activity.id">Edit</span>
            <span @click="removeActivity(activity)">Delete</span>
          </div>
        </div>
      </div>
      <template v-else-if="isActiveOpen">
        <div
          class="active-comment flex"
          :class="{
            'active-comment-space': isActivityId === activity.id,
          }"
          :key="idx"
        >
          <avatar
            class="avatar-comment"
            :size="32"
            :username="activity.createdBy.username"
            :src="activity.createdBy.imgUrl"
            v-if="activity.createdBy.username"
          ></avatar>
          <div class="active-input flex">
            <span class="active-username">{{
              activity.createdBy.username
            }}</span>
            <span class="active-title">{{
              (activity.title =
                activity.title.length > 50
                  ? activity.title.slice(0, 50) + "..."
                  : activity.title)
            }}</span>
            <span class="active-date">{{
              activity.createdAt | moment("from")
            }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { cardService } from "../../../service/card.service.js";
import { userService } from "../../../service/user.service";
import mentionPopup from "../action-popup/add-mention.vue";
import actionCmp from "../action-popup/actions-popup.vue";
import Avatar from "vue-avatar";
import { debounce } from "../../../service/util.service.js";
import { innerHtml } from "../../../service/html.service.js";

export default {
  name: "activity",
  props: {
    board: Object,
    card: Object,
  },
  data() {
    return {
      mentions: [],
      isEditOpen: false,
      isActivityId: "",
      isOpen: false,
      logInUser: userService.getLoggedinUser(),
      activities: "",
      members: this.getMembers,
      comment: cardService.createActivity(
        "comment",
        null,
        "",
        this.$route.query.listId,
        this.$route.query.cardId
      ),
      isActivityOpen: {},
      action: null,
      tempActivity: "",
      isActiveOpen: false,
    };
  },
  methods: {
    commentToHtml(comment) {
      return innerHtml(comment);
    },
    setByPop(user) {
      const { username } = user;
      var mentions = this.comment.title;
      mentions = mentions ? mentions.match(/\B@\w+/g) : null;
      const mention = mentions ? mentions[mentions.length - 1] : null;
      this.comment.title = this.comment.title.replace(mention, "@" + username);
      this.comment.mentions.push({ ...user, mention: "@" + username });
    },
    setMentionToEdit(event, activity) {
      const mentions = this.comment.title.match(/\B@\w+/g);
      this.comment.mentions = this.comment.mentions.filter((user) =>
        mentions.find((mention) => user.mention === mention)
      );
      const cmp = this;
      const command = function () {
        if (activity) var mentions = activity.title;
        else var mentions = cmp.comment.title;
        mentions = mentions ? mentions.match(/\B@\w+/g) : null;
        const mention = mentions ? mentions[mentions.length - 1] : null;
        if (mention && !cmp.mentions.includes(mention)) {
          const memberInCard = cmp.card.members.filter(
            (user) =>
              !cmp.comment.mentions.find(
                (mention) => mention.username === user.username
              )
          );
          if (memberInCard.length)
            cmp.action = {
              type: "mention",
              offset: { x: 0, y: 0 },
              target: event.target,
              position: "fixed",
              title: "Tag member",
              memberInCard,
              search: false,
              mention,
            };
        }
      };
      debounce(command, "comment", 500);
    },
    addAttachment(event) {
      this.$emit("attach", {
        type: "attachment",
        offset: { x: 0, y: 0 },
        here: true,
        event,
      });
      const card = cardService.getCardById(this.$route.query.cardId);
      const attach = card.addAttachment[addAttachment.length - 1].url;
    },
    addActivity() {
      this.$store.dispatch({ type: "setActivity", activity: this.comment });
      this.comment = cardService.createActivity(
        "comment",
        null,
        "",
        this.$route.query.listId,
        this.$route.query.cardId
      );
      this.isOpen = false;
    },
    updateActivity(comment) {
      this.isEditOpen = false;
      this.isActivityId = "";
      // comment.type = "comment";
      this.$store.dispatch({ type: "setActivity", activity: comment });
    },
    removeActivity(comment) {
      // comment.type = "comment";
      this.$store.dispatch({ type: "removeActivity", activity: comment });
    },
    closeEditMode() {
      this.isEditOpen = false;
      this.isActivityId = "";
    },
    setActivityOpen(activityId) {
      this.isActivityOpen[activityId] = !this.isActivityOpen[activityId];
    },
    getIsExist(id) {
      return this.isActivityOpen[id];
    },
  },
  computed: {
    openDetailsTitle() {
      return this.isActiveOpen ? "Hide Details" : "Show Details";
    },
    getActivities() {
      return this.$store.getters.getActivities;
    },
    getUser() {
      return this.$store.getters.loggedinUser;
    },
    getMembers() {
      return this.$store.getters.getMembers;
    },
  },
  watch: {},
  components: {
    Avatar,
    mentionPopup,
    actionCmp,
  },
};
</script>
