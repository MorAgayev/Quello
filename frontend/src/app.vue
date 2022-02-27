<template>
  <div id="app">
    <app-header :user="$store.getters.loggedinUser"></app-header>
    <router-view />
  </div>
</template>

<script>
import appHeader from "./components/app-header.vue";

export default {
  components: {
    appHeader,
  },
};
</script>
