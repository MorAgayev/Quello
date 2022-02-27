import Vue from 'vue'
import Vuex from 'vuex'

import authStore from "./auth-store.js";
import boardStore from "./board-store";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    authStore,
    boardStore,
  }
})
