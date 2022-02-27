<template>
  <section class="attachment-page" v-if="card">
    <div class="attachment-head">
      <span></span>
      <h3 class="card-item-title">Attachments</h3>
    </div>
    <div
      v-for="attach in attachments"
      :key="attach.id"
      class="attachment-contant"
    >
      <img :src="attach.url" @click="preview(attach.url)" />
      <div class="attachment-title">
        <span class="text">{{ attach.fileName }}</span>
        <a @click="preview(attach.url)"><span class="attach-link"></span></a>
        <div class="links">
          <span>Add {{ attach.createdAt | moment("from") }}</span>
          <a href="">Comments</a>
          <a href="" @click.prevent="removeAttach(attach)">Delete</a>
          <a href="" @click.prevent="toggleEdit(attach.id)">Edit</a>
          <edit-attachment
            v-if="isEdit && isEditModeId === attach.id"
            :attachment="attach"
            @updateTitle="updateTitle"
            @close="toggleEdit()"
          ></edit-attachment>
        </div>
        <div class="cover-link">
          <span class="icon"></span>
          <span @click="setCover(attach.url)">{{ isCover(attach.url) }}</span>
        </div>
      </div>
    </div>
    <div class="attachment-btn">
      <button @click="toggleAddModal">Add an attachment</button>
    </div>
  </section>
</template>

<script>
import { deepCopy, debounce } from "../../../service/util.service.js";
import { cardService } from "../../../service/card.service.js";
import { loadCover } from "../../../service/media.service.js";
import editAttachment from "../action-popup/edit-attachment.vue";

export default {
  props: {
    card: Object,
  },
  data() {
    return {
      action: null,
      isAddModal: false,
      attachments: [],
      isEdit: false,
      isEditModeId: null,
    };
  },
  methods: {
    addComment() {
      //open activity box with attachment title & url
    },
    preview(url) {
      const query = Object.assign(
        { ...this.$route.query },
        { media: url, tag: "IMG" }
      );
      this.$router.replace({ query });
    },
    removeAttach(attach) {
      this.removeCover(attach.url);
      this.$emit("remove", { key: "attachments", item: attach });
      const attIdx = this.attachments.findIndex((att) => att === attach);
      if (attIdx > -1) this.attachments.splice(attIdx, 1);
    },
    toggleEdit(id) {
      if (id) this.isEditModeId = id;
      else this.isEditModeId = null;
      this.isEdit = !this.isEdit;
    },
    updateTitle(attach) {
      this.$emit("add", attach);
      this.toggleEdit();
    },
    addItem(attach) {
      this.$emit("add", attach);
    },
    async setCover(url) {
      const cover = deepCopy(this.card.cover);
      if (url) {
        cover.color = await loadCover(url);
        let imgId = cover.imgs.find((el) => el.url === url)?.id;
        if (!imgId) {
          const newImg = cardService.setImg(url);
          cover.imgId = newImg.id;
          cover.imgs.unshift(newImg);
          cover.imgs = cover.imgs.slice(0, 3);
        } else cover.imgId = imgId;
        this.$emit("cover", { item: cover, key: "cover" });
      } else {
        cover.imgId = null;
        cover.color = "";
        this.$emit("cover", { item: cover, key: "cover" });
      }
    },
    async removeCover(url) {
      try {
        const cover = deepCopy(this.card.cover);
        const imgIdx = cover.imgs.findIndex((el) => el.url === url);
        if (imgIdx > -1) {
          const img = cover.imgs[imgIdx];
          cover.imgs.splice(imgIdx, 1);
          if (cover.imgId === img.id) {
            cover.imgId = null;
            this.$emit("cover", cover);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    isCover(url) {
      const cover = this.card.cover;
      return cover.imgId &&
        cover.imgs.find((el) => el.id === cover.imgId)?.url === url
        ? "Remove Cover"
        : "Make Cover";
    },
    toggleAddModal(event) {
      this.$emit("popup", {
        type: "attachment",
        target: event.target,
        offset: { x: 0, y: 80 },
        here: true,
      });
    },
  },
  components: {
    editAttachment,
  },
  watch: {
    "card.attachments": {
      handler(data) {
        debounce((this.attachments = deepCopy(data)), "attachments", 250);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style></style>
