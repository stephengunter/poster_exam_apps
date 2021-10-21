import BillsService from '@/services/bills.service';
import { FETCH_BILLS, BILL_DETAILS } from '@/store/actions.type';
import { SET_LOADING, SET_BILLS } from '@/store/mutations.type';

const initialState = {
   pagedList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_BILLS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         BillsService.fetch(params)
            .then(model => {
               context.commit(SET_BILLS, model);
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
   [BILL_DETAILS](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         BillsService.details(id)
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
   [SET_BILLS](state, model) {
      state.pagedList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 