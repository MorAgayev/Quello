<template>
  <section class="card-description" ref="desc">
    <div class="title">
      <span class="icon" />
      <h3 class="card-item-title">Description</h3>
    </div>
    <textarea
      v-if="isFocus || !this.description"
      :style="textAreaStyle"
      ref="textEdit"
      @focus="isFocus = true"
      @blur="save()"
      placeholder="Add a more detailed description..."
      spellcheck="false"
      v-model="description"
    ></textarea>
    <div
      v-else
      class="description"
      @click="focus"
      :contenteditable="isFocus"
      v-html="isFocus ? description : text"
    ></div>
    <div class="controls" v-if="isFocus">
      <button @click="save()" class="save task-btn">Save</button>
      <button @click="load()" class="cancel task-btn">X</button>
    </div>
  </section>
</template>

<script>
import { innerHtml } from "../../../service/html.service.js";
import {
  debounce,
  deepCopy,
  getKeywords,
  isWordIgnored,
} from "../../../service/util.service.js";

export default {
  name: "description",
  props: {
    card: Object,
  },
  data() {
    return {
      count: 0,
      description: "",
      isFocus: false,
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.description = deepCopy(this.card.desc);
      this.isFocus = false;
    },
    save() {
      debounce(
        () => {
          this.$emit("set", { item: this.description, key: "desc" });
          this.isFocus = false;
        },
        "desc",
        10
      );
    },
    focus(ev) {
      const { link } = ev.target.dataset;
      if (link) {
        const query = Object.assign(
          { ...this.$route.query },
          { media: decodeURIComponent(link), tag: ev.target.tagName }
        );
        this.$router.replace({ query });
        return;
      }
      this.count++;
      debounce(
        () => {
          if (this.count >= 2) this.isFocus = true;
          if (this.isFocus)
            this.$nextTick(() => {
              this.$refs.textEdit.focus();
            });
          this.count = 0;
        },
        "focus",
        300
      );
    },
  },
  computed: {
    textAreaStyle() {
      const lineCount = this.description?.split("\n")?.length || 1;
      const height = Math.max(lineCount * 26, this.isFocus ? 108 : 40);
      return { height: height + "px" };
    },
    divContentStyle() {
      return this.isFocus ? { "white-space": "pre-wrap" } : "";
    },
    text() {
      return innerHtml(this.description, this.$route.fullPath);
    },
  },
  watch: {
    card: {
      async handler(data) {
        this.description = data.desc;
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
