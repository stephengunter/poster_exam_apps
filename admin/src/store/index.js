import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import subjects from './modules/subjects.module';
import terms from './modules/terms.module';
import recruits from './modules/recruits.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      auth,
      subjects,
      terms,
      recruits
   }
});
