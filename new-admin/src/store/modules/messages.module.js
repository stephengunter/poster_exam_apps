import MessagesService from '@/services/messages.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_MESSAGES, EDIT_MESSAGE, UPDATE_MESSAGE
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_MESSAGES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         MessagesService.fetch(params)
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
   },
   [EDIT_MESSAGE](context, id) {
      return new Promise((resolve, reject) => {
         MessagesService.edit(id)
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
   },
   [UPDATE_MESSAGE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         MessagesService.update(model.id, model.model)
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
 