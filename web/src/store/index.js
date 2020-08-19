import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import notifications from './modules/notifications.module';
import messages from './modules/messages.module';
import notices from './modules/notices.module';
import notes from './modules/notes.module';
import questions from './modules/questions.module';
import terms from './modules/terms.module';
import rqs from './modules/rqs.module';
import exams from './modules/exams.module';
import manuals from './modules/manuals.module';
import subscribes from './modules/subscribes.module';
import bills from './modules/bills.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      auth,
      notifications,
      messages,
      notices,
      notes,
      questions,
      terms,
      rqs,
      exams,
      manuals,
      subscribes,
      bills     
   }
});
