<template>
  <div class="card-details-container" @click="goBack" v-if="card">
    <media-preview @close="closeMedia" />
    <msg-modal
      :msg="msg"
      @close="msg = null"
      @cancel="msg = null"
      @delete="deleteConfirm"
    />
    <action-cmp
      v-if="action"
      @set="dispatchSetItem"
      @remove="dispatchRemoveItem"
      @close="action = null"
      :card="card"
      :action="action"
    ></action-cmp>
    <section class="card-details" @keydown.esc="goBack">
      <div class="card-details-main" @click.stop>
        <div class="cover" :style="coverStyle">
          <img v-if="getCover" :src="getCover" />
          <div
            :style="darkStyle"
            class="close-card-details"
            @click="$router.push({ path: $route.path })"
          ></div>
          <div class="cover-main flex">
            <button
              :style="darkStyle"
              class="cover-btn flex"
              @click="
                action = {
                  type: 'Cover',
                  target: $event.target,
                  position: 'fixed',
                }
              "
            >
              <span></span>Cover
            </button>
          </div>
        </div>

        <div class="archived" v-if="card.archiveAt">
          <svg
            width="24"
            height="24"
            role="presentation"
            focusable="false"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.03418 5.59621C2.98604 5.04603 3.39303 4.56099 3.94322 4.51286L19.8823 3.11837C20.4325 3.07023 20.9175 3.47722 20.9657 4.02741L21.0528 5.0236L3.12133 6.5924L3.03418 5.59621Z"
              fill="currentColor"
            ></path>
            <path
              d="M9 12.9999C9 12.4476 9.44772 11.9999 10 11.9999H14C14.5523 11.9999 15 12.4476 15 12.9999C15 13.5522 14.5523 13.9999 14 13.9999H10C9.44772 13.9999 9 13.5522 9 12.9999Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 18.9999V7.99993H21V18.9999C21 20.1045 20.1046 20.9999 19 20.9999H5C3.89543 20.9999 3 20.1045 3 18.9999ZM5 9.99993H19V18.9999H5L5 9.99993Z"
              fill="currentColor"
            ></path>
          </svg>
          <p>This card is archived.</p>
        </div>

        <div class="header">
          <div class="header-content" ref="container">
            <span></span>
            <textarea
              name=""
              id=""
              cols="30"
              rows="1"
              placeholder="Title"
              v-model="card.title"
              :style="textAreaStyle"
              @focus="resizeTextarea"
              @keyup="resizeTextarea"
              @change="dispatchSetItem({ item: card.title, key: 'title' })"
              spellcheck="false"
            ></textarea>
            <p>In list {{ getListName }}</p>
          </div>
        </div>

        <div class="card-details-body">
          <main class="main-task flex">
            <div class="main-task-details">
              <combo-list
                v-if="showComboList"
                :card="card"
                @set="dispatchSetItem"
                @popup="(act) => (action = act)"
              />
              <description :card="card" @set="dispatchSetItem" />
              <check-list
                v-if="card.checkList && card.checkList.length"
                :card="card"
                @set="dispatchSetItem"
                @remove="dispatchRemoveItem"
              />
              <attachments
                v-if="card.attachments && card.attachments.length"
                :card="card"
                @remove="dispatchRemoveItem"
                @cover="dispatchSetItem"
                @popup="(act) => (action = act)"
              />
              <item-location
                v-if="card.location"
                :card="card"
                @popup="(act) => (action = act)"
              />

              <activity
                :card="card"
                :board="board"
                @attach="(act) => (action = act)"
              />
            </div>
            <div class="main-task-btns flex">
              <h3>SUGGESTED</h3>
              <div class="action-btns flex">
                <button><span></span> Join</button>
              </div>
              <h3>Add to card</h3>
              <div class="action-btns flex">
                <button
                  v-for="title in addToCardTxt"
                  :key="'btn-' + title"
                  @click="
                    action = {
                      type: title,
                      target: $event.target,
                      offset: { y: 36, x: 0 },
                      lists: board.lists.map((list) => list.id),
                    }
                  "
                >
                  <span :class="toClass(title) + '-icon'"></span>
                  {{ title }}
                </button>
              </div>
              <h3>Actions</h3>
              <div class="action-btns flex">
                <button
                  v-for="title in actionsBtn"
                  :key="'btn-' + title"
                  @click="handleAction(title, $event)"
                  :class="toClass(title) + '-btn'"
                >
                  <span :class="toClass(title) + '-icon'"></span>
                  {{ title }}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import mediaPreview from "./media-preview.vue";
import attachments from "./items/item-attaschments.vue";
import checkList from "../cards/items/item-checklist.vue";
import activity from "../cards/items/item-activity.vue";
import description from "../cards/items/item-description.vue";
import comboList from "./items/item-combolist.vue";
import actionCmp from "./action-popup/actions-popup.vue";
import itemLocation from "./items/item-location.vue";
import msgModal from "@/components/msg-modal.vue";

import {
  isHexColorLight,
  sentenceToKababCase,
} from "../../service/util.service";
import { cardService } from "../../service/card.service";

export default {
  name: "card",
  props: {
    board: Object,
  },
  data() {
    return {
      addToCardTxt: [
        "Members",
        "Labels",
        "CheckList",
        "Dates",
        "Attachment",
        "Location",
        "Cover",
      ],
      action: null,
      msg: null,
      card: null,
    };
  },
  methods: {
    closeMedia() {
      const query = Object.assign({}, this.$route.query);
      delete query.media;
      delete query.tag;
      this.$router.replace({ query });
    },
    goBack() {
      if (this.action) return;
      this.$emit("close");
    },
    async dispatchSetItem({ item, key }) {
      // console.log("dispatchSetItem():", item, key);
      const listId = this.$route.query.listId;
      const cardId = this.card.id;
      item = await this.$store.dispatch({
        type: "setItem",
        item,
        listId,
        cardId,
        key,
      });
      this.updateCard(listId, cardId);
      return item;
    },
    async dispatchRemoveItem({ item, key }) {
      // console.log("dispatchRemoveItem():", item, key);
      const listId = this.$route.query.listId;
      const cardId = this.card.id;
      item = await this.$store.dispatch({
        type: "removeItem",
        item,
        listId,
        cardId,
        key,
      });
      this.updateCard(listId, cardId);
      return item;
    },
    async updateCard(listId, cardId) {
      try {
        this.card = await this.$store.dispatch({
          type: "getCardById",
          listId,
          cardId,
        });
        return this.card;
      } catch (err) {
        console.log(err);
      }
    },
    deleteConfirm() {
      const listId = this.$route.query.listId;
      this.$emit("remove", { listId, card: this.card });
      this.$emit("close");
    },
    changeTextAreaSize() {
      this.$nextTick(() => {
        this.$refs.container.forEach((ta) => {
          ta.firstChild.dispatchEvent(new Event("keyup"));
        });
      });
    },
    resizeTextarea: function (e) {
      let area = e.target;
      area.style.height = area.scrollHeight - 4 + "px";
    },
    async handleAction(action, event) {
      const listId = this.$route.query.listId;
      const path = this.$route.path;
      switch (action) {
        case "Copy":
          const copyCard = await this.$store.dispatch({
            type: "copyCard",
            listId,
            card: { ...this.card, title: this.card.title + " (Copy)" },
          });
          this.$router.push(`${path}?listId=${listId}&cardId=${copyCard.id}`);
          break;
        case "Send to board":
        case "Archive":
          if (this.card.archiveAt)
            this.dispatchSetItem({ item: 0, key: "archiveAt" });
          else this.dispatchSetItem({ item: Date.now(), key: "archiveAt" });
          break;
        case "Delete":
          this.msg = {
            title: "Delete card",
            value:
              "All actions will be removed from the activiy\nfeed and you won't be able to re-open the\ncard. There is no undo.",
            background: true,
            controls: { delete: "delete-btn", cancel: "cancel-btn" },
          };
          break;
        case "Share":
          break;
      }
    },
    toClass(str) {
      return sentenceToKababCase(str);
    },
  },
  computed: {
    textAreaStyle() {
      const lineCount = this.card.title?.match(/.{1,62}/g)?.length || 1;
      return { height: lineCount * 28 + 6 + "px" };
    },
    getCover() {
      return this.card.cover.imgs.find(
        (cover) => cover.id === this.card.cover.imgId
      )?.url;
    },
    getListName() {
      return this.board.lists.find(
        (list) => list.id === this.$route.query.listId
      )?.title;
    },
    showComboList() {
      return (
        this.card.dueDate.date ||
        (this.card.members && this.card.members.length) ||
        (this.card.labelsIds && this.card.labelsIds.length)
      );
    },
    setBgColor() {
      return this.card.cover.color;
    },
    coverStyle() {
      return { background: this.card.cover.color };
    },
    darkStyle() {
      return !isHexColorLight(this.card.cover.color)
        ? { filter: "invert(1)", color: "black" }
        : {};
    },
    actionsBtn() {
      return this.card.archiveAt
        ? ["Copy", "Send to board", "Delete", "Share"]
        : ["Copy", "Archive", "Share"];
    },
  },
  watch: {
    "card.title.length": {
      handler() {
        this.changeTextAreaSize;
      },
      deep: true,
      immediate: true,
    },
    "$route.query.cardId": {
      async handler(cardId) {
        if (cardId) {
          const listId = this.board.lists.find((list) =>
            list.cards.find((card) => card.id === cardId)
          )?.id;
          this.card = await cardService.getCardById(this.board, listId, cardId);
        } else this.card = null;
      },
      immediate: true,
    },
  },
  components: {
    mediaPreview,
    attachments,
    description,
    checkList,
    comboList,
    activity,
    actionCmp,
    itemLocation,
    msgModal,
  },
};
</script>
