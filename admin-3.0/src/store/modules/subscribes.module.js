import SubscribesService from '@/services/subscribes.service';
import { FETCH_SUBSCRIBES } from '@/store/actions.type';
import { SET_LOADING, SET_SUBSCRIBES } from '@/store/mutations.type';

const initialState = {
   pagedList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_SUBSCRIBES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubscribesService.fetch(params)
            .then(model => {
               context.commit(SET_SUBSCRIBES, model);
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
   [SET_SUBSCRIBES](state, model) {
      state.pagedList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 