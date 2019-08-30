import SubjectsService from '@/services/subjects.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_SUBJECTS, CREATE_SUBJECT, STORE_SUBJECT, 
   EDIT_SUBJECT, UPDATE_SUBJECT, DELETE_SUBJECT
} from '@/store/actions.type';

import { SET_SUBJECTS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_SUBJECTS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubjectsService.fetch(params)
            .then(subjects => {
               context.commit(SET_SUBJECTS, subjects);
               resolve(subjects);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_SUBJECT](context) {
      return new Promise((resolve, reject) => {
         SubjectsService.create()
            .then(model => {
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
   [STORE_SUBJECT](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubjectsService.store(model)
            .then(SUBJECT => {
               resolve(SUBJECT);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_SUBJECT](context, id) {
      return new Promise((resolve, reject) => {
         SubjectsService.edit(id)
            .then(model => {
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
   [UPDATE_SUBJECT](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubjectsService.update(model.id, model)
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
   [DELETE_SUBJECT](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubjectsService.remove(id)
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
   
   
};


const mutations = {
   [SET_SUBJECTS](state, subjects) {
      state.list = subjects;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 