import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import dashboard from './modules/dashboard.module';
import messages from './modules/messages.module';
import notices from './modules/notices.module';
import plans from './modules/plans.module';
import users from './modules/users.module';
import subjects from './modules/subjects.module';
import terms from './modules/terms.module';
import notes from './modules/notes.module';
import termQuestions from './modules/term-questions.module';
import questions from './modules/questions.module';
import options from './modules/options.module';
import resolves from './modules/resolves.module';
import attachments from './modules/attachments.module';
import recruits from './modules/recruits.module';
import recruitQuestions from './modules/recruit-questions.module';
import manuals from './modules/manuals.module';
import features from './modules/features.module';
import db from './modules/db.module';
import analysis from './modules/analysis.module';
import settings from './modules/settings.module';

Vue.use(Vuex);

export default new Vuex.Store({
   modules: {
      app,
      auth,
      dashboard,
      messages,
      notices,
      plans,
      users,
      subjects,
      terms,
      notes,
      termQuestions,
      questions,
      options,
      resolves,
      attachments,
      recruits,
      recruitQuestions,
      manuals,
      features,
      db,
      analysis,
      settings
   }
});
