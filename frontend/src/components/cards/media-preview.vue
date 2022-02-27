<template>
  <div
    v-if="media.url"
    class="media-preview-container"
    @click.stop="$emit('close')"
  >
    <img v-if="media.tag === 'IMG'" :src="media.url" />
    <div class="browser" v-else-if="isIframe">
      <div class="browser-container">
        <button>X</button>
        <iframe
          frameboarder="0"
          allowfullscreen="1"
          :src="media.url"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
const IFRAME = ["map"];

export default {
  name: "media",
  computed: {
    media() {
      const { media: url, tag } = this.$route.query;
      if (tag === "A") {
        window.open(url, "_blank", "location=yes,scrollbars=yes,status=no");
        this.$emit("close");
        return {};
      }
      return { url, tag };
    },
    isIframe() {
      const { tag } = this.media;
      return IFRAME.includes(tag);
    },
  },
};
</script>
