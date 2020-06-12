import ManualsService from '@/services/manuals.service';
import { resolveErrorData } from '@/utils';

import { FETCH_MANUALS } from '@/store/actions.type';
import { SET_LOADING, SET_MANUALS, SET_MANUAL } from '@/store/mutations.type';



const initialState = {
   model: null,
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [FETCH_MANUALS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.fetch(params)
            .then(data => {
               if(Array.isArray(data)) context.commit(SET_MANUALS, data);
               else context.commit(SET_MANUAL, data);

               resolve(data);
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
   [SET_MANUALS](state, list) {
      state.list = list;
   },
   [SET_MANUAL](state, model) {
      state.model = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 