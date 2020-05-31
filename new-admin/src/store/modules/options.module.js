import OptionService from '@/services/options.service';
import { resolveErrorData } from '@/utils';

import { STORE_OPTIONS } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [STORE_OPTIONS](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         OptionService.store(model)
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
 