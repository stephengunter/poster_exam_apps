import NoticesService from '@/services/notices.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_NOTICES, CREATE_NOTICE, STORE_NOTICE, 
   EDIT_NOTICE, UPDATE_NOTICE, OFF_NOTICE, DELETE_NOTICE
} from '@/store/actions.type';

import { SET_NOTICES, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   pagedList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_NOTICES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NoticesService.fetch(params)
            .then(model => {
               context.commit(SET_NOTICES, model);
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
   [CREATE_NOTICE](context) {
      return new Promise((resolve, reject) => {
         NoticesService.create()
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
   [STORE_NOTICE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NoticesService.store(model)
            .then(notice => {
               resolve(notice);
            })
            .catch(error => {
               reject(resolveErrorData(error));
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_NOTICE](context, id) {
      return new Promise((resolve, reject) => {
         NoticesService.edit(id)
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
   [UPDATE_NOTICE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NoticesService.update(model.id, model)
            .then(notice => {
               resolve(notice);
            })
            .catch(error => {
               console.log('error', error);
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [OFF_NOTICE](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NoticesService.off(id)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [DELETE_NOTICE](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NoticesService.remove(id)
            .then(() => {
               resolve(true);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   
   
};


const mutations = {
   [SET_NOTICES](state, model) {
      state.pagedList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 