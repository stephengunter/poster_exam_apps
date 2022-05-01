import ManualsService from '@/services/manuals.service';
import { resolveErrorData } from '@/utils';

import { FETCH_MANUALS, CREATE_MANUAL, STORE_MANUAL,
   EDIT_MANUAL, MANUAL_DETAILS, UPDATE_MANUAL, DELETE_MANUAL, ORDER_MANUALS
} from '@/store/actions.type';
import { SET_LOADING, SET_MANUALS } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [FETCH_MANUALS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.fetch(params)
            .then(list => {
               context.commit(SET_MANUALS, list);
               resolve(list);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [CREATE_MANUAL](context, params) {
      return new Promise((resolve, reject) => {
         ManualsService.create(params)
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
   [STORE_MANUAL](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.store(model)
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
   [EDIT_MANUAL](context, id) {
      return new Promise((resolve, reject) => {
         ManualsService.edit(id)
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
   [MANUAL_DETAILS](context, id) {
      return new Promise((resolve, reject) => {
         ManualsService.details(id)
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
   [UPDATE_MANUAL](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.update(model.id, model)
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
   [ORDER_MANUALS](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.order(model)
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
   [DELETE_MANUAL](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ManualsService.remove(id)
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
   [SET_MANUALS](state, list) {
      state.list = list;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 