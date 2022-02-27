<template>
  <section v-if="action" @click.stop>
    <div class="actions-cmp" :style="stylePosition" ref="actionPopup">
      <div class="action-content">
        <div
          class="header flex"
          @click.stop.prevent
          @mousedown="mouseStart"
          @mousemove="mouseMove"
          @mouseup="mouseStop"
          @mouseleave="mouseStop"
        >
          <h4>{{ action.title || action.type }}</h4>
          <span @click="$emit('close')"></span>
        </div>
        <component
          :card="card"
          :is="getComponent"
          @close="$emit('close')"
          @add="(item) => $emit('set', item)"
          @remove="(item) => $emit('remove', item)"
          @copy="(card) => $emit('copy', card)"
          @move="(card) => $emit('move', card)"
          :action="action"
          :board="board"
        />
      </div>
    </div>
  </section>
</template>

<script>
import attachment from "./add-attachment.vue";
import members from "./add-member.vue";
import checklist from "./add-checklist.vue";
import labels from "./add-label.vue";
import dates from "./add-date.vue";
import location from "./add-location.vue";
import cover from "./set-cover.vue";
import mention from "./add-mention.vue";
import copy from "./add-card.vue";
import move from "./add-card.vue";

export default {
  name: "Actions",
  props: {
    action: Object,
    card: Object,
  },
  data() {
    return {
      board: null,
      top: null,
      left: null,
      bottom: null,
      right: null,
      component: null,
      data: this.action,
      mouse: {
        position: null,
        isDown: false,
        offset: {},
        max: null,
      },
      offset: this.action.offset || { x: 0, y: 0 },
    };
  },
  created() {
    this.board = this.$store.getters.getBoard;
  },
  methods: {
    add(item) {
      console.log("item >>>", item);
      this.$emit("set", item);
    },
    remove(item) {
      this.$emit("remove", item);
    },
    mouseStart(event) {
      this.mouse.offset = {
        x: event.clientX - event.target.parentElement.parentElement.offsetLeft,
        y: event.clientY - event.target.parentElement.parentElement.offsetTop,
      };
      this.offset = [
        this.$el.offsetLeft - event.clientX,
        this.$el.offsetTop - event.clientY,
      ];
      this.mouse.isDown = true;
    },
    mouseStop() {
      this.mouse.isDown = false;
    },
    mouseMove(event) {
      event.preventDefault();
      if (this.mouse.isDown) {
        this.mouse.position = {
          x: event.clientX,
          y: event.clientY,
        };
        const position = {
          x: this.mouse.position.x - this.mouse.offset.x,
          y: this.mouse.position.y - this.mouse.offset.y,
        };
        if (position.x > 0 && position.y > 0) {
          this.left = position.x;
          this.top = position.y;
        }
      }
    },
  },
  computed: {
    stylePosition() {
      const style = { position: this.action.position || "absolute" };
      const { top, left, bottom, right } = this;
      if (window.scrollY + top + 440 > window.scrollY + window.innerHeight)
        style.top = window.scrollY + top - 440 + "px";
      else style.top = window.scrollY + top + "px";
      if (left + 305 > window.scrollX + window.innerWidth)
        style.right = 22 + "px";
      else style.left = left + "px";
      return style;
    },
    getComponent() {
      return this.action.type.toLowerCase();
    },
  },
  watch: {
    action: {
      async handler(data) {
        if (!this.mouse.max)
          this.mouse.max = {
            x: window.scrollX + window.innerWidth,
            y: window.scrollY + window.innerHeight,
          };
        try {
          const el = data.target;
          const { top, left, right, bottom } = await el.getBoundingClientRect();
          this.top = top + this.offset?.y;
          this.left = left + this.offset?.x;
          this.bottom = bottom - this.offset?.y;
          this.right = right - this.offset?.x;
        } catch (err) {}
      },
      deep: true,
      immediate: true,
    },
  },
  components: {
    attachment,
    members,
    checklist,
    labels,
    dates,
    location,
    cover,
    mention,
    copy,
    move,
  },
};
</script>
