import RQService from '@/services/rqs.service';
import { resolveErrorData } from '@/utils';

import { FETCH_RQS } from '@/store/actions.type';


import { SET_RQS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   parts: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_RQS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RQService.fetch(params)
         .then(model => {
            context.commit(SET_RQS, model.parts);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
   
};


const mutations = {
   [SET_RQS](state, parts) {
      state.parts = parts;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 