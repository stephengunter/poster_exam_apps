import PasswordService from '@/services/password.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_PASSWORDS, CREATE_PASSWORD, STORE_PASSWORD, 
   EDIT_PASSWORD, UPDATE_PASSWORD, DELETE_PASSWORD
} from '@/store/actions.type';

import { SET_PASSWORD_INDEX_MODEL, SET_PASSWORDS, SET_PASSWORD_CATEGORIES, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   indexModel: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_PASSWORDS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PasswordService.fetch(params)
            .then(model => {
               context.commit(SET_PASSWORD_INDEX_MODEL, model);
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
   [CREATE_PASSWORD](context) {
      return new Promise((resolve, reject) => {
         PasswordService.create()
            .then(model => {
               context.commit(SET_REGIONS, model.regions);
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
   [STORE_PASSWORD](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PasswordService.store(model)
            .then(PASSWORD => {
               resolve(PASSWORD);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_PASSWORD](context, id) {
      return new Promise((resolve, reject) => {
         PasswordService.edit(id)
            .then(model => {
               context.commit(SET_REGIONS, model.regions);
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
   [UPDATE_PASSWORD](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PasswordService.update(model)
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
   },
   [DELETE_PASSWORD](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PasswordService.remove(id)
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
   },
   
   
};


const mutations = {
   [SET_PASSWORD_INDEX_MODEL](state, model) {
      state.indexModel = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 