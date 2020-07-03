import ResolveService from '@/services/resolves.service';
import { FETCH_RESOLVES, STORE_RESOLVE, UPDATE_RESOLVE, DELETE_RESOLVE } from '@/store/actions.type';
import { SET_LOADING, SET_RESOLVES } from '@/store/mutations.type';

import { resolveErrorData } from '@/utils';


const initialState = {
   pageList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_RESOLVES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ResolveService.fetch(params)
            .then(model => {
               context.commit(SET_RESOLVES, model);
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
   [STORE_RESOLVE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ResolveService.store(model)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [UPDATE_RESOLVE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ResolveService.update(model.id, model)
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
   [DELETE_RESOLVE](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ResolveService.remove(id)
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
   [SET_RESOLVES](state, model) {
      state.pageList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 