import MessagesService from '@/services/messages.service';
import { resolveErrorData } from '@/utils';

import { STORE_MESSAGE } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';

const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
};

const actions = {
   [STORE_MESSAGE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         MessagesService.store(model)
         .then(id => {
            resolve(id);
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
 