import PaysService from '@/services/pays.service';
import { FETCH_PAYS, PAY_DETAILS } from '@/store/actions.type';
import { SET_LOADING, SET_PAYS } from '@/store/mutations.type';

const initialState = {
   pagedList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_PAYS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PaysService.fetch(params)
            .then(model => {
               context.commit(SET_PAYS, model.pagedList);
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
   [PAY_DETAILS](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PaysService.details(id)
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
   }
};


const mutations = {
   [SET_PAYS](state, model) {
      state.pagedList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 