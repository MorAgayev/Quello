<template>
  <div class="card-preview-container">
    <!-- Quick action menu -->
    <action-cmp
      v-if="action"
      @click.stop
      @close="action = null"
      @set="dispatchSetItem"
      @remove="dispatchRemoveItem"
      @copy="dispatchSetCard"
      :card="card"
      :action="action"
    ></action-cmp>
    <!-- Preview -->
    <section
      :class="props.className"
      :style="previewBackgroundStyle"
      class="card-preview flex"
      v-if="card"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
      @click="
        $router.push({
          path: `${$route.path}?listId=${listId}&cardId=${card.id}`,
        })
      "
    >
      <template v-if="!getCover.isFull">
        <div
          class="card-cover-color full"
          v-if="getCover.color && !getCover.url"
          :style="{ backgroundColor: getCover.color }"
        ></div>
      </template>

      <img
        v-if="getCover.url"
        :src="getCover.url"
        class="card-img"
        :draggable="false"
        :style="imgStyle"
      />

      <span v-if="isHover" class="edit-icon" @click.stop="openMenu"></span>

      <div
        class="btn-preview"
        :class="{ 'full-cover': getCover.isFull && getCover.url }"
      >
        <div class="card-labels flex">
          <div
            :class="{ 'label-open': isShown }"
            class="label"
            v-for="label in getLabelFromIds"
            :key="label.id"
            :style="{ backgroundColor: label.color }"
            :title="label.title"
            @click.stop="$emit('setShown')"
          >
            <span>{{ label.title }}</span>
          </div>
        </div>

        <textarea v-model="title" v-if="isEditMode" @click.stop></textarea>
        <p
          v-else
          class="card-title"
          :style="{ ...fullCoverColorStyle, ...fullCoverFontStyle }"
        >
          {{ card.title }}
        </p>
        <card-preview-badge
          :card="card"
          :fullCoverColorStyle="fullCoverColorStyle"
          @set="dispatchSetItem"
        />
      </div>
    </section>
    <!-- Quick Edit -->
    <card-quick-edit
      v-if="isEditMode"
      :config="quickEditConfig"
      :card="card"
      :listId="listId"
      @close="
        isEditMode = null;
        action = null;
      "
      @action="(act) => (action = act)"
    />
  </div>
</template>

<script>
import { isHexColorLight } from "../../service/util.service";
import actionCmp from "./action-popup/actions-popup.vue";
import cardPreviewBadge from "./card-preview-badge.vue";
import cardQuickEdit from "./card-preview-quick-edit.vue";

var moment = require("moment");
moment().format();
export default {
  props: {
    card: Object,
    listId: String,
    props: {
      type: Object,
      default() {
        return {
          className: "",
          style: "",
        };
      },
    },
    isShown: Boolean,
  },
  data() {
    return {
      isHover: false,
      board: this.getBoards,
      isEditMode: false,
      quickEditConfig: {
        left: null,
        top: null,
      },
      title: this.card.title,
      action: null,
    };
  },
  methods: {
    async openMenu(ev) {
      const el = ev.target.parentElement;
      const max = {
        top: window.scrollY + window.innerHeight,
        left: window.scrollX + window.innerWidth,
      };
      const { top, left, right, bottom } = el.getBoundingClientRect();
      this.quickEditConfig.left =
        right + 136 > max.left ? left - 136 : right + 6;
      this.quickEditConfig.top = top + 252 > max.top ? bottom - 252 : top;
      this.isEditMode = !this.isEditMode;
    },
    async dispatchSetItem({ item, key }) {
      const listId = this.$route.query.listId;
      const cardId = this.card.id;
      // console.log("dispatchSetItem():", item, key);
      item = await this.$store.dispatch({
        type: "setItem",
        item,
        listId,
        cardId,
        key,
      });
      return item;
    },
    async dispatchSetCard({ card, listId }) {
      // console.log("dispatchSetCard():", listId, card);
      card = await this.$store.dispatch({ type: "setCard", listId, card });
    },
    async dispatchRemoveItem({ item, key }) {
      // console.log("dispatchRemoveItem():", item, key);
      item = await this.$store.dispatch({
        type: "removeItem",
        item,
        listId: this.$route.query.listId,
        cardId: this.card.id,
        key,
      });
      return item;
    },
  },
  computed: {
    imgStyle() {
      const { isFull, url } = this.getCover;
      return isFull && url
        ? { visibility: "hidden", "max-height": "80px" }
        : { "max-height": "140px" };
    },
    fullCoverColorStyle() {
      const { isFull, isDark, color, url } = this.getCover;
      if (isFull) {
        return isDark || (!url && !isHexColorLight(color))
          ? { filter: "invert(1)", color: "black", fill: "black" }
          : {};
      }
      return {};
    },
    fullCoverFontStyle() {
      const { isFull } = this.getCover;
      return isFull ? { "font-size": "16px", "font-weight": "500" } : {};
    },
    previewBackgroundStyle() {
      const { isFull, url, color } = this.getCover;
      let style = { ...this.props.style };
      if (this.isEditMode) style = { ...style, "z-index": 2 };
      if (isFull)
        style = url
          ? {
              ...style,
              backgroundImage: `url("${url}")`,
              "min-height": "160px",
            }
          : {
              ...style,
              background: color,
            };
      return style;
    },
    getLabelFromIds() {
      const boardLabels = this.$store.getters.boardLabels;
      return this.card.labelsIds
        .map((id) => boardLabels.find((label) => label.id === id))
        .filter((label) => !!label);
    },
    getBoards() {
      return this.$store.getters.getBoards;
    },
    getCover() {
      const { imgId, imgs, color, isFull } = this.card.cover;
      const url = imgId ? imgs.find((img) => img.id === imgId)?.url : null;
      return { url, color, isFull };
    },
  },
  components: {
    actionCmp,
    cardPreviewBadge,
    cardQuickEdit,
  },
};
</script>
