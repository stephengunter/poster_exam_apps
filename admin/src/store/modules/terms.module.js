import TermsService from '@/services/terms.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_TERMS, CREATE_TERM, STORE_TERM, 
   EDIT_TERM, UPDATE_TERM, DELETE_TERM
} from '@/store/actions.type';

import { SET_TERMS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_TERMS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.fetch(params)
            .then(terms => {
               resolve(terms);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_TERM](context, params) {
      return new Promise((resolve, reject) => {
         TermsService.create(params)
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
   [STORE_TERM](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.store(model)
            .then(TERM => {
               resolve(TERM);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_TERM](context, id) {
      return new Promise((resolve, reject) => {
         TermsService.edit(id)
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
   [UPDATE_TERM](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.update(model.id, model)
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
   [DELETE_TERM](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.remove(id)
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
 