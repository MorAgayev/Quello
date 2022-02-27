<template>
  <div
    v-if="msg"
    class="msg-modal"
    @keydown.esc="onClick(null)"
    :style="backgroundStyle"
  >
    <div
      class="window"
      :class="{ center: !msg.event }"
      :style="windowStyle"
      @click.stop=""
    >
      <div class="title">
        <div class="text">{{ msg.title }}</div>
        <span @click="onClick(null)" />
        <div type="button" class="close" @click="onClick(null)"></div>
      </div>
      <div class="text">{{ msg.value }}</div>
      <div class="buttons">
        <button
          v-for="(className, button) in msg.controls"
          @click="onClick(button)"
          :key="button"
          :class="className"
        >
          {{ getTitle(button) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sentenceToCamelCase,
  camelCaseToSentence,
  deepCopy,
} from "../service/util.service";

export default {
  name: "msg-modal",
  props: {
    msg: Object,
  },
  methods: {
    onClick(cmd) {
      if (cmd) this.$emit(sentenceToCamelCase(cmd), deepCopy(this.msg));
      else this.$emit("close");
    },
    getTitle(title) {
      return camelCaseToSentence(title);
    },
  },
  computed: {
    backgroundStyle() {
      return this.msg.background
        ? { "background-color": "rgba(0, 0, 0, 0.5)" }
        : {};
    },
    windowStyle() {
      return this.msg.event
        ? { top: this.msg.event.y + "px", left: this.msg.event.x + "px" }
        : {};
    },
  },
};
</script>
