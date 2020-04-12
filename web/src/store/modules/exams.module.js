import ExamsService from '@/services/exams.service';
import { resolveErrorData, examActions } from '@/utils';

import { FETCH_EXAMS, CREATE_EXAM, STORE_EXAM, UPDATE_EXAM, READ_EXAM,
   SAVE_EXAM, ABORT_EXAM, EDIT_EXAM, LOAD_EXAM_SUMMARY
} from '@/store/actions.type';

import { SET_LOADING, SET_EXAM_PAGE_MODE, SET_EXAM_INDEX_MODEL,
   SET_EXAMS, SET_EXAM, SET_EXAM_TITLE, SET_EXAM_ACTIONS
} from '@/store/mutations.type';

const initialState = {
   indexModel: null,
   mode: null,
   pagedList: null,
   exam: null,
   actions: [],
   hasAnswers: [],
   noAnswers: [],
   summary: {
      hasAnswers: [],
      noAnswers: [],
      corrects: [],
      wrongs: []
   }
   
};

export const state = { ...initialState };
 
const getters = {
   exam(state) {
      return state.exam;
   },
   examIndexMode(state) {
      return state.mode && state.mode.name === 'index';
   },
   examCreateMode(state) {
      return state.mode && state.mode.name === 'create';
   },
   examEditMode(state) {
      return state.mode && state.mode.name === 'edit';
   }
};

const setExam = (context, exam) => {
   let index = 1;
   exam.parts.forEach(part => {
      part.questions.forEach(question => {
         question.index = index;
         index += 1;
      })
   });
   context.commit(SET_EXAM, exam);
   context.commit(SET_EXAM_ACTIONS, examActions(exam));
}

const actions = {
   [FETCH_EXAMS](context, params) {
      let firstLoad = params.page < 0;
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.fetch(params)
            .then(model => {
               if(firstLoad)  context.commit(SET_EXAM_INDEX_MODEL, model);
               context.commit(SET_EXAMS, model.pagedList);
               resolve(model);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_EXAM](context, params) {
      context.commit(SET_EXAM, null);
      context.commit(SET_EXAM_ACTIONS, []);

      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.create(params)
         .then(exam => {
            setExam(context, exam);
            resolve(exam);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [SAVE_EXAM](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.save(model.id, model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [EDIT_EXAM](context, id) {
      context.commit(SET_EXAM, null);
      context.commit(SET_EXAM_ACTIONS, []);

      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.edit(id)
         .then(exam => {
            setExam(context, exam);
            resolve(exam);
         })
         .catch(error => {
            reject(resolveErrorData(error));        
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [UPDATE_EXAM](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.update(model.id, model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [STORE_EXAM](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.store(model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [READ_EXAM](context, id) {
      context.commit(SET_EXAM, null);
      context.commit(SET_EXAM_ACTIONS, []);

      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.details(id)
         .then(exam => {
            setExam(context, exam);
            resolve(exam);
         })
         .catch(error => {
            reject(resolveErrorData(error));        
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [ABORT_EXAM](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.abort(id)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [LOAD_EXAM_SUMMARY](context) {
      let state = context.state;
      let exam = state.exam;

      if(exam.isComplete) {
         let correctQuestions = [];
         let wrongQuestions = [];
         exam.parts.forEach(part => {
            part.questions.forEach(question => {
               if(question.correct) correctQuestions.push(question);
               else wrongQuestions.push(question);
            })
         });
         state.summary.corrects = correctQuestions;
         state.summary.wrongs = wrongQuestions;
         state.summary.hasAnswers = [];
         state.summary.noAnswers = [];
      }else {
         let hasAnswers = [];
         let noAnswers = [];
         exam.parts.forEach(part => {
            part.questions.forEach(question => {
               if(question.userAnswerIndexes) {
                  //有答案
                  hasAnswers.push(question);
               }else noAnswers.push(question);
            })
         });
         state.summary.corrects = [];
         state.summary.wrongs = [];
         state.summary.hasAnswers = hasAnswers;
         state.summary.noAnswers = noAnswers;
      }
   }
   
};


const mutations = {
   [SET_EXAM_INDEX_MODEL](state, model) {
      state.indexModel = model;
   },
   [SET_EXAM_PAGE_MODE](state, mode) {
      state.mode = mode;
   },
   [SET_EXAMS](state, pagedList) {
      state.pagedList = pagedList;
   },
   [SET_EXAM](state, exam) {
      state.exam = exam;
   },
   [SET_EXAM_TITLE](state, title) {
      state.exam.title = title;
   },
   [SET_EXAM_ACTIONS](state, actions) {
      state.actions = actions;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 