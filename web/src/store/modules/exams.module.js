import ExamsService from '@/services/exams.service';
import { resolveErrorData, examActions } from '@/utils';

import { INIT, FETCH_EXAMS, INIT_EXAMS, CREATE_EXAM, STORE_EXAM, 
   UPDATE_EXAM, READ_EXAM, SAVE_EXAM, ABORT_EXAM, EDIT_EXAM, LOAD_EXAM_SUMMARY
} from '@/store/actions.type';

import { SET_LOADING, SET_EXAM_INDEX_MODEL, SET_EXAM_CREATE_PARAMS,
   SET_EXAMS, SET_EXAM, SET_EXAM_TITLE, SET_EXAM_RESERVED, SET_EXAM_ACTIONS
} from '@/store/mutations.type';

const initialState = {
   indexModel: null,
   pagedList: null,
   list: [],
   createParams: { recruit: 0 },
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
   [INIT](context) {
      context.commit(SET_EXAM, null);
   },
   [FETCH_EXAMS](context, params) {
      if(params.page <= 1) context.commit(SET_EXAMS, null);
      let firstLoad = params.page < 0;
      if(params.page <= 1) context.commit(SET_LOADING, true);
      
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
               if(params.page <= 1) context.commit(SET_LOADING, false);
            });
      });
   },
   [INIT_EXAMS](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.init()
            .then(model => {
               context.commit(SET_EXAM_INDEX_MODEL, model);
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
            context.commit(SET_EXAM_RESERVED, true);
            context.commit(SET_EXAM_TITLE, model.title);
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
   [SET_EXAM_CREATE_PARAMS](state, params) {
      state.createParams = params;
   },
   [SET_EXAMS](state, pagedList) {
      if(pagedList) {
         state.pagedList = pagedList;
         let viewList = pagedList.viewList;
         if(viewList && viewList.length) {
            state.list = state.list.concat(viewList);
         }
      }else {
         state.pagedList = null;
         state.list = [];
      }
   },
   [SET_EXAM](state, exam) {
      if(exam) state.exam = exam;
      else {
         state.exam = null;
         state.hasAnswers = [];
         state.noAnswers = [];
         state.summary = {
            hasAnswers: [],
            noAnswers: [],
            corrects: [],
            wrongs: []
         };
      }
      
   },
   [SET_EXAM_TITLE](state, title) {
      state.exam.title = title;
   },
   [SET_EXAM_RESERVED](state, val) {
      state.exam.reserved = val;
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
 