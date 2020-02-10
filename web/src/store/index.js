import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import notes from './modules/notes.module';
import rqs from './modules/rqs.module';
import exams from './modules/exams.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      auth,
      notes,
      rqs,
      exams
   }
});
