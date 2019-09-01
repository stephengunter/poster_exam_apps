import QuestionsService from '@/services/questions.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_QUESTIONS, CREATE_QUESTION, STORE_QUESTION, 
   EDIT_QUESTION, UPDATE_QUESTION, DELETE_QUESTION
} from '@/store/actions.type';

import { SET_QUESTIONS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_QUESTIONS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         QuestionsService.fetch(params)
            .then(questions => {
               resolve(questions);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_QUESTION](context, params) {
      return new Promise((resolve, reject) => {
         QuestionsService.create(params)
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
   [STORE_QUESTION](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         QuestionsService.store(model)
            .then(QUESTION => {
               resolve(QUESTION);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_QUESTION](context, id) {
      return new Promise((resolve, reject) => {
         QuestionsService.edit(id)
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
   [UPDATE_QUESTION](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         QuestionsService.update(model.id, model)
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
   [DELETE_QUESTION](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         QuestionsService.remove(id)
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
   
};

export default {
   state,
   actions,
   mutations,
   getters
};
 