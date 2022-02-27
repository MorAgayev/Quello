<template>
  <section class="change-background">
    <div class="background-select" v-if="!isPhotoOpen && !isColorOpen">
      <div class="image-user-select flex align-center justify-center">
        <div class="image-select" @click="getUnsplashPhotos">
          <img
            @click="isPhotoOpen = !isPhotoOpen"
            class="image"
            src="https://a.trellocdn.com/prgb/dist/images/photos-thumbnail@3x.8f9c1323c9c16601a9a4.jpg"
          />
          <div class="title">Photos</div>
        </div>
        <div class="color-select">
          <img
            @click="isColorOpen = true"
            class="image"
            src="https://a.trellocdn.com/prgb/dist/images/colors@2x.ec32a2ed8dd8198b8ef0.jpg"
          />
          <div class="title">Colors</div>
        </div>
      </div>
      <hr />
      <h2>Custom</h2>
      <div class="custom-image-container flex">
        <div class="custom-image">
          <span></span>
          <div class="input-image">
            <input type="file" name="" id="" @change="onUploadImg" />
          </div>
        </div>
        <div
          class="image-custom-select"
          v-for="(url, idx) in customImages"
          :key="'CBG' + idx"
        >
          <img :src="url" alt="" @click="setBg({ backgroundImage: url })" />
        </div>
      </div>
    </div>
    <div class="unsplash-section" v-if="isPhotoOpen">
      <input type="text" name="" id="" placeholder="Photos" v-model="search" />
      <div class="unsplash-container flex">
        <span></span>
        <div class="image" v-for="image in unsplashImg" :key="image.id">
          <img
            :src="image.urls.small"
            alt=""
            @click="
              setBg({
                backgroundImage: image.urls.regular,
                backgroundThumb: image.urls.thumb,
              })
            "
          />
        </div>
      </div>
    </div>
    <div class="unsplash-colors" v-if="isColorOpen">
      <div class="unsplash-container flex">
        <div
          class="image"
          v-for="(color, idx) in colors"
          :key="idx"
          :style="{ backgroundColor: color }"
          @click="setBg({ backgroundColor: color })"
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  uploadImg,
  getUnsplash,
  loadCover,
} from "../../../service/media.service";
import { debounce, isHexColorLight } from "../../../service/util.service";
import colorsPattern from "../../../assets/json/colors.json";

export default {
  props: {
    board: {
      type: Object,
    },
  },
  data() {
    return {
      isPhotoOpen: false,
      isColorOpen: false,
      unsplashImg: [],
      search: "",
      customImages: this.board.style.customImages || [],
      colors: colorsPattern,
    };
  },
  created() {
    this.getUnsplashPhotos();
  },
  methods: {
    async setBg({
      backgroundImage = null,
      backgroundColor = null,
      backgroundThumb = null,
    }) {
      let bg = {};
      if (backgroundImage) {
        var color = await loadCover(backgroundThumb || backgroundImage);
        bg = {
          type: "img",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
          backgroundThumb: backgroundThumb ? `url(${backgroundThumb})` : null,
          isDark: !isHexColorLight(color),
        };
      } else
        bg = {
          type: "color",
          backgroundColor,
          isDark: !isHexColorLight(backgroundColor),
        };
      this.$emit("set", {
        key: "style",
        item: { ...bg, customImages: this.customImages },
      });
    },
    async onUploadImg(ev) {
      let res = await uploadImg(ev);
    },
    async getUnsplashPhotos() {
      const photos = {
        page: 1,
        perPage: 50,
        orderBy: 1,
        query: this.search || this.board.title || "wallpaper",
      };
      const updatedPhotos = await getUnsplash(photos);
      this.unsplashImg = updatedPhotos.data.results;
    },
    async onUploadImg(ev) {
      let res = await uploadImg(ev);
      this.customImages.push(`url(${res.url})`);
      this.setBg({ backgroundImage: `url(${res.url})` });
    },
  },
  computed: {},
  watch: {
    search: {
      handler() {
        debounce(this.getUnsplashPhotos, "unsplach");
      },
    },
  },
};
</script>

<style></style>
