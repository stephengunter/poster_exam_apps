import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import users from './modules/users.module';
import subjects from './modules/subjects.module';
import terms from './modules/terms.module';
import notes from './modules/notes.module';
import questions from './modules/questions.module';
import options from './modules/options.module';
import resolves from './modules/resolves.module';
import attachments from './modules/attachments.module';
import recruits from './modules/recruits.module';
import recruitQuestions from './modules/recruit-questions.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      auth,
      users,
      subjects,
      terms,
      notes,
      questions,
      options,
      resolves,
      attachments,
      recruits,
      recruitQuestions
   }
});
