import ResolveService from '@/services/resolves.service';
import { STORE_RESOLVE, UPDATE_RESOLVE, DELETE_RESOLVE } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';

import { resolveErrorData } from '@/utils';


const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [STORE_RESOLVE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ResolveService.store(model)
         .then(id => {
            resolve(id);
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
   
};

export default {
   state,
   actions,
   mutations,
   getters
};
 