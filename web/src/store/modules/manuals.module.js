import ManualsService from '@/services/manuals.service';
import { resolveErrorData } from '@/utils';

import { FETCH_MANUALS } from '@/store/actions.type';
import { SET_LOADING, SET_MANUALS } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [FETCH_MANUALS](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.fetch()
            .then(list => {
               context.commit(SET_MANUALS, list);
               resolve(list);
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
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 