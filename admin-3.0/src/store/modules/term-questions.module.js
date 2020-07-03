import TermQuestionsService from '@/services/term-questions.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_TERM_QUESTIONS, STORE_TERM_QUESTION, DELETE_TERM_QUESTION
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';


const initialState = {
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_TERM_QUESTIONS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermQuestionsService.fetch(params)
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
   [STORE_TERM_QUESTION](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermQuestionsService.store(model)
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
   [DELETE_TERM_QUESTION](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermQuestionsService.remove(model)
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
 