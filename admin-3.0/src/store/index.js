import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app.module';
import auth from './modules/auth.module';
import show from './modules/show.module';
import exceptions from './modules/exceptions.module';
import messages from './modules/messages.module';
import notices from './modules/notices.module';
import subscribes from './modules/subscribes.module';
import plans from './modules/plans.module';
import bills from './modules/bills.module';
import pays from './modules/pays.module';
import users from './modules/users.module';
import subjects from './modules/subjects.module';
import terms from './modules/terms.module';
import medias from './modules/medias.module';
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
      show,
      exceptions,
      messages,
      notices,
      subscribes,
      plans,
      bills,
      pays,
      users,
      subjects,
      terms,
      medias,
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
