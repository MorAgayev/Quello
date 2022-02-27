<template>
  <section class="cover">
    <div class="main-cover-selection" v-if="!isSearching">
      <div class="size-section">
        <label>
          Size
          <div v-if="getCoverImg || cover.color" class="size-container">
            <button
              @click="setCoverSize(true)"
              :class="{ active: cover.isFull }"
            >
              <img v-if="getCoverImg" class="full" :src="getCoverImg" />
              <div
                v-else
                class="color full"
                :style="{ background: cover.color }"
              />
              <div class="over" v-if="getCoverImg" />
              <div class="demmy title" :style="darkStyle" />
              <div class="demmy text" :style="darkStyle" />
            </button>
            <button
              @click="setCoverSize(false)"
              :class="{ active: !cover.isFull }"
            >
              <img v-if="getCoverImg" class="split" :src="getCoverImg" />
              <div
                v-else
                class="color split"
                :style="{ background: cover.color }"
              />
              <div class="demmy title" />
              <div class="demmy text" />
            </button>
          </div>
        </label>
      </div>
      <div class="color-section">
        <label>
          Color
          <div class="colors-container">
            <button
              v-for="color in colors"
              :key="color"
              :style="{ background: color }"
              :class="{ active: !cover.imgId && cover.color === color }"
              @click="setCover('color', color)"
            ></button>
          </div>
        </label>
      </div>
      <div class="attachment-section">
        <label>
          Attachment
          <label class="upload">
            Upload a cover image
            <input type="file" id="uploadImg" @change="onUploadImg" hidden />
          </label>
        </label>
      </div>
      <div
        class="recent-section"
        v-if="card.cover.imgs && card.cover.imgs.length"
      >
        <label>Recent</label>
        <div class="img-section">
          <div
            v-for="image in card.cover.imgs.slice(0, 3)"
            :key="image.id"
            :class="{ active: cover.imgId && cover.imgId === image.id }"
          >
            <img :src="image.url" alt="" @click="setCover('img', image.url)" />
          </div>
        </div>
      </div>
      <div class="unsplash-section">
        <label> Photos from Unsplash </label>
        <div class="img-section">
          <div v-for="image in unsplashImg.slice(0, 6)" :key="image.id">
            <img
              :src="image.urls.small"
              alt=""
              @click="setCover('img', image.urls.small)"
            />
          </div>
        </div>
        <button
          class="search-photos-unsplash"
          @click="isSearching = !isSearching"
        >
          Search for photos
        </button>
      </div>
    </div>
    <addSearchUnsplash
      @close="isSearching = !isSearching"
      v-else
      :keywords="keywords"
      :unsplashImg="unsplashImg"
      @set="({ type, val }) => setCover(type, val)"
    />
  </section>
</template>

<script>
import addSearchUnsplash from "./add-search-unsplash.vue";
import { cardService } from "../../../service/card.service";
import {
  getUnsplash,
  loadCover,
  uploadImg,
} from "../../../service/media.service";
import {
  deepCopy,
  getKeywords,
  isHexColorLight,
} from "../../../service/util.service";
import colorPattern from "../../../assets/json/colors.json";
export default {
  props: {
    card: {
      type: Object,
    },
  },
  data() {
    return {
      cover: deepCopy(this.card.cover),
      unsplashImg: [],
      colors: colorPattern.slice(0, 10),
      isSearching: false,
      // keyword: getKeywords(this.card.title),
      keywords: getKeywords([this.card.title, this.card.desc]),
    };
  },
  created() {
    this.getUnsplashPhotos();
  },
  methods: {
    setCoverSize(isFull) {
      this.cover.isFull = isFull;
      this.setCover();
    },
    async onUploadImg(ev) {
      const { url } = await uploadImg(ev);
      await this.setCover("img", url);
    },
    async setCover(type, val) {
      const cover = this.cover;
      if (type === "color") {
        cover.color = cover.color === val ? null : val;
        cover.imgId = null;
      } else if (type === "img") {
        let img;
        if ((img = cover.imgs.find((img) => img.url === val)))
          cover.imgId = cover.imgId === img.id ? null : img.id;
        else {
          img = cardService.setImg(val);
          cover.imgId = img.id;
          cover.imgs.unshift(img);
          cover.imgs = cover.imgs.slice(0, 3);
        }
        cover.color = cover.imgId ? await loadCover(img.url) : null;
      }
      this.$emit("add", { item: cover, key: "cover" });
    },
    async getUnsplashPhotos() {
      const photos = {
        page: 1,
        perPage: 12,
        orderBy: 1,
        query: this.card.title || "wallpaper",
      };
      const updatedPhotos = await getUnsplash(photos);
      this.unsplashImg = updatedPhotos.data.results;
    },
  },
  computed: {
    getCoverImg() {
      const cover = this.cover;
      if (!cover.imgId) return null;
      return cover.imgs.find((img) => img.id === cover.imgId).url;
    },
    darkStyle() {
      const cover = this.cover;
      return cover.isDark || (!cover.imgId && !isHexColorLight(cover.color))
        ? { filter: "invert(1)", background: "black" }
        : {};
    },
  },
  watch: {},
  components: {
    addSearchUnsplash,
  },
};
</script>

<style></style>
