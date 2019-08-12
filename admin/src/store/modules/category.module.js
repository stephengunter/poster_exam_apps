import CategoryService from '@/services/category.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_CATEGORIES, CREATE_CATEGORY, STORE_CATEGORY, 
   EDIT_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY
} from '@/store/actions.type';

import { SET_CATEGORIES, SET_CATEGORY_TYPES, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   passwordCategories: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_CATEGORIES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CategoryService.fetch(params)
            .then(model => {
               context.commit(SET_CATEGORIES, model.pageList);
               if(model.types && model.types.length){
                  context.commit(SET_CATEGORY_TYPES, model.types);
               }
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
   [CREATE_CATEGORY](context) {
      return new Promise((resolve, reject) => {
         CategoryService.create()
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
   [STORE_CATEGORY](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CategoryService.store(model)
            .then(CATEGORY => {
               resolve(CATEGORY);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [EDIT_CATEGORY](context, id) {
      return new Promise((resolve, reject) => {
         CategoryService.edit(id)
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
   [UPDATE_CATEGORY](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CategoryService.update(model)
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
   [DELETE_CATEGORY](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CategoryService.remove(id)
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
   [SET_CATEGORYS](state, pageList) {
      state.pageList = pageList;
   },
   [SET_CATEGORY_CATEGORIES](state, categories) {
      state.categories = categories;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 