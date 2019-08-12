import Vue from 'vue';
window.Bus = new Vue({});

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.component('loading', Loading);

import '@/components';
import '@/plugins'
import router from '@/routes';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import App from './App.vue';


sync(store, router);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
