import TermsService from '@/services/terms.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_TERMS, CREATE_TERM, STORE_TERM, TERM_DETAILS, 
   EDIT_TERM, UPDATE_TERM, DELETE_TERM
} from '@/store/actions.type';

import { SET_TERMS, SET_TERM_PARENTS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   list: [],
   parents: []
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
               context.commit(SET_TERM_PARENTS, model.parents);
               resolve(model.term);
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
            .then(term => {
               resolve(term);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [TERM_DETAILS](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.details(id)
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
   [EDIT_TERM](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.edit(id)
         .then(model => {
            context.commit(SET_TERM_PARENTS, model.parents);
            resolve(model.term);
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
   [SET_TERMS](state, terms) {
      state.list = terms;
   },
   [SET_TERM_PARENTS](state, parents) {
      state.parents = parents;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 