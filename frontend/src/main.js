import Vue from 'vue'
import app from './app.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '../src/style/styles.scss'
import ElementUI from 'element-ui'
import * as VueGoogleMaps from "vue2-google-maps";
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import GAuth from 'vue-google-oauth2'

export const GOOGLEAPI = "AIzaSyCsws2HKpTeFtrOSEHhq1Elss5JpUYK4pQ";

const gauthOption = {
  clientId: '38315529562-dg5ktsmidio1hn9vcdmma75p03m0fi0q.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'consent',
  fetch_basic_profile: true
}
Vue.use(GAuth, gauthOption)
Vue.config.productionTip = false
Vue.config.devtools = false;
Vue.use(Toast, {});
Vue.use(ElementUI, { locale })

window
  .matchMedia('(display-mode: standalone)')
  .addEventListener('change', ({ matches }) => {
    if (matches) {
      $('#installAppButton').hide();
    } else {
      $('#installAppButton').show();
    }
  });

library.add(fas, fab)

Vue.use(require('vue-moment'));
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.use(VueGoogleMaps, {
  load: {
    key: GOOGLEAPI,
    libraries: "places", // necessary for places input
    region: "en",
  }
});

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')
