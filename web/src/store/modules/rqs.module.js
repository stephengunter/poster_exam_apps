import RQService from '@/services/rqs.service';

import { FETCH_RQS } from '@/store/actions.type';
import { SET_RQS_MODEL, SET_LOADING } from '@/store/mutations.type';

const initialState = {
   model: null
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
            if(model.parts) {
               context.commit(SET_RQS_MODEL, model);
            }
            resolve(model);
         })
         .catch(error => {
            context.commit(SET_RQS_MODEL, null);
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
   
};


const mutations = {
   [SET_RQS_MODEL](state, model) {
      state.model = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 