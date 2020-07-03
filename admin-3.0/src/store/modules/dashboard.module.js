import DashboardService from '@/services/dashboard.service';

import {
   FETCH_EXCEPTIONS
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';


const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_EXCEPTIONS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DashboardService.fetchExceptions(params)
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
   
};

export default {
   state,
   actions,
   mutations,
   getters
};
 