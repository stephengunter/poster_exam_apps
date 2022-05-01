import ManualsService from '@/services/manuals.service';
import { resolveErrorData } from '@/utils';

import { FETCH_MANUALS, MANUAL_DETAILS } from '@/store/actions.type';
import { SET_LOADING, SET_MANUALS, SET_MANUAL } from '@/store/mutations.type';



const initialState = {
   model: null,
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
   },
   [MANUAL_DETAILS](context, id) {
      let manual = context.state.list.find(item => item.id === id);
      if(manual) context.commit(SET_MANUAL, manual);
      else {
         manual = context.state.list.find(item => item.subIds.includes(id));
         context.commit(SET_MANUAL, manual);
      }
   }
};


const mutations = {
   [SET_MANUALS](state, list) {
      state.list = list;
   },
   [SET_MANUAL](state, model) {
      if(model) {
         if(state.model && state.model.id === model.id) return;
         state.model = model;
      }else state.model = null;      
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 