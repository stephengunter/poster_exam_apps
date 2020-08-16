import FeaturesService from '@/services/features.service';
import { resolveErrorData } from '@/utils';

import { CREATE_FEATURE, STORE_FEATURE,
   EDIT_FEATURE, UPDATE_FEATURE, DELETE_FEATURE, ORDER_FEATURES
} from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [CREATE_FEATURE](context) {
      return new Promise((resolve, reject) => {
         FeaturesService.create()
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
   [STORE_FEATURE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         FeaturesService.store(model)
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
   [EDIT_FEATURE](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         FeaturesService.edit(id)
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
   [UPDATE_FEATURE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         FeaturesService.update(model.id, model)
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
   [ORDER_FEATURES](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         FeaturesService.order(model)
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
   [DELETE_FEATURE](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         FeaturesService.remove(id)
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
   
};

export default {
   state,
   actions,
   mutations,
   getters
};
 