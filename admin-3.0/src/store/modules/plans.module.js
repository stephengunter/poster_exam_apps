import PlansService from '@/services/plans.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_PLANS, CREATE_PLAN, STORE_PLAN, EDIT_PLAN, UPDATE_PLAN, 
   CLEAR_PLAN,DELETE_PLAN
} from '@/store/actions.type';

import { SET_LOADING, SET_PLANS, SET_ALL_PLANS } from '@/store/mutations.type';

const initialState = {
   all: [],
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_PLANS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PlansService.fetch(params)
            .then(plans => {
               if(params != null && params.active >= 0) {
                  context.commit(SET_PLANS, plans);
               } 
               else context.commit(SET_ALL_PLANS, plans);
               resolve(plans);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_PLAN](context) {
      return new Promise((resolve, reject) => {
         PlansService.create()
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
   [STORE_PLAN](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PlansService.store(model)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [EDIT_PLAN](context, id) {
      return new Promise((resolve, reject) => {
         PlansService.edit(id)
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
   [UPDATE_PLAN](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PlansService.update(model.id, model)
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
   [CLEAR_PLAN](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PlansService.clear(id)
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
   [DELETE_PLAN](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         PlansService.remove(id)
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
   [SET_PLANS](state, plans) {
      state.list = plans;
   },
   [SET_ALL_PLANS](state, plans) {
      state.all = plans;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 