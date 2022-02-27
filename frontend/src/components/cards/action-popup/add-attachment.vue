<template>
  <section class="attachment flex">
    <label class="computer-link">
      Computer
      <input type="file" id="uploadImg" @change="onUploadImg" hidden />
    </label>
    <label class="link-input">
      Attach a link
      <input
        class="txt-input full"
        type="text"
        placeholder="Past any link here..."
        v-model="url"
      />
    </label>
    <button @click="onLinkAttach">Attach</button>
    <!-- <p>Tip: You can drag and drop files onto cards to upload them</p> -->
  </section>
</template>

<script>
import { cardService } from "../../../service/card.service";
import { uploadImg } from "../../../service/media.service";

export default {
  data() {
    return {
      url: "",
    };
  },
  methods: {
    async onUploadImg(ev) {
      let res = await uploadImg(ev);
      var item = cardService.addAttachment(
        res.url,
        res.original_filename,
        res.resource_type,
        res.format
      );
      this.$emit("add", { key: "attachments", item });
      this.$emit("close");
    },
    onLinkAttach() {
      if (!this.url) return;
      const url = this.url;
      const filename = url.substring(url.lastIndexOf("/") + 1);
      const suffix = url.substring(url.lastIndexOf(".") + 1);
      const item = cardService.addAttachment(url, filename, "image", suffix);
      this.$emit("add", { key: "attachments", item });
      this.$emit("close");
    },
  },
};
</script>

<style></style>
