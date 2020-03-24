import TermsService from '@/services/terms.service';

import { TERM_DETAILS } from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';

const initialState = {
  
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [TERM_DETAILS](context, id) {
      return new Promise((resolve, reject) => {
         TermsService.details(id)
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
 