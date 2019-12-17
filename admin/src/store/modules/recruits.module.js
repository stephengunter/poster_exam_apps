import RecruitsService from '@/services/recruits.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_RECRUITS, CREATE_RECRUIT, STORE_RECRUIT, 
   EDIT_RECRUIT, UPDATE_RECRUIT, DELETE_RECRUIT
} from '@/store/actions.type';

import { SET_RECRUITS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_RECRUITS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RecruitsService.fetch(params)
            .then(recruits => {
               context.commit(SET_RECRUITS, recruits);
               resolve(recruits);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_RECRUIT](context) {
      return new Promise((resolve, reject) => {
         RecruitsService.create()
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
   [STORE_RECRUIT](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RecruitsService.store(model)
            .then(recruit => {
               resolve(recruit);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_RECRUIT](context, id) {
      return new Promise((resolve, reject) => {
         RecruitsService.edit(id)
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
   [UPDATE_RECRUIT](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RecruitsService.update(model.id, model)
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
   [DELETE_RECRUIT](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RecruitsService.remove(id)
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
   [SET_RECRUITS](state, recruits) {
      state.list = recruits;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 