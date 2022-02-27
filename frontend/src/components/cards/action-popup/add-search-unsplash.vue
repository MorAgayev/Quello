<template>
  <section class="search-unsplash-photos">
    <span class="back" @click="$emit('close')"></span>
    <input
      type="text"
      name=""
      id=""
      placeholder="Search Unsplash for photos"
      v-model="search"
    />
    <div class="preference-photos-unsplash" v-if="!search">
      <label> Suggested searches </label>
      <div class="suggest-keywords">
        <button
          v-for="keyword in keywords"
          @click="search = keyword"
          :key="'b-' + keyword"
        >
          {{ keyword[0].toUpperCase() + keyword.slice(1) }}
        </button>
      </div>
      <label> Top photos </label>
      <div class="top-photos">
        <div v-for="image in unsplashImg" :key="image.id">
          <img
            :src="image.urls.small"
            alt=""
            @click="$emit('set', { type: 'img', val: image.urls.small })"
          />
        </div>
      </div>
    </div>
    <div class="unsplash-gallery" v-else>
      <div class="" v-for="image in unsplashSearchImg" :key="image.id">
        <img
          :src="image.urls.small"
          alt=""
          @click="$emit('set', { type: 'img', val: image.urls.small })"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { getUnsplash } from "../../../service/media.service";
import { debounce } from "../../../service/util.service";
export default {
  props: {
    keywords: Array,
    unsplashImg: Array,
  },
  data() {
    return {
      search: "",
      unsplashSearchImg: [],
    };
  },
  created() {},
  methods: {
    async getUnsplashPhotos() {
      const photos = {
        page: 1,
        perPage: 54,
        orderBy: 1,
        query: this.search,
      };
      const updatedPhotos = await getUnsplash(photos);
      this.unsplashSearchImg = updatedPhotos.data.results;
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
