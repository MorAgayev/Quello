<template>
  <div id="app">
    <google-map />
  </div>
</template>

<script>
import GoogleMap from "./item-location.vue";
export default {
  name: "App",
  components: { GoogleMap },
};
</script>
