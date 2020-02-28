import CategoriesService from '@/services/categories.service';
import { FETCH_CATEGORIES } from '@/store/actions.type';
import { SET_LOADING, SET_CATEGORIES } from '@/store/mutations.type';


const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_CATEGORIES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         CategoriesService.fetch(params)
            .then(categories => {
               context.commit(SET_CATEGORIES, categories);
               resolve(categories);
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
   [SET_CATEGORIES](state, categories) {
      state.list = categories;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 