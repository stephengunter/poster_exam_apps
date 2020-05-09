import Vue from 'vue';
import { TiptapVuetifyPlugin } from 'tiptap-vuetify';
import 'tiptap-vuetify/dist/main.css';

// AFTER Vue.use(Vuetify) !!!
Vue.use(TiptapVuetifyPlugin, {
  iconsGroup: 'mdi'
})