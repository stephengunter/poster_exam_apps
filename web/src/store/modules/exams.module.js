import ExamsService from '@/services/exams.service';
import { resolveErrorData } from '@/utils';
import { FETCH_EXAMS, CREATE_EXAM, STORE_EXAM,
   SAVE_EXAM, ABORT_EXAM, EDIT_EXAM
} from '@/store/actions.type';
import { SET_LOADING, SET_EXAMS } from '@/store/mutations.type';

const initialState = {
   pagedList: null
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [FETCH_EXAMS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.fetch(params)
            .then(model => {
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
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExamsService.create(params)
         .then(model => {
            resolve(model);
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
      return new Promise((resolve, reject) => {
         ExamsService.edit(id)
         .then(model => {
            resolve(model);
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
   }
   
};


const mutations = {
   [SET_EXAMS](state, pagedList) {
      state.pagedList = pagedList;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 