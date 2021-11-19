import ArticlesService from '@/services/articles.service';

import { FETCH_ARTICLES, ARTICLE_DETAILS } from '@/store/actions.type';

import { SET_LOADING, SET_ARTICLES } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_ARTICLES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ArticlesService.fetch(params)
            .then(list => {
               context.commit(SET_ARTICLES, list);
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
   [ARTICLE_DETAILS](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ArticlesService.details(id)
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
   }
};


const mutations = {
   [SET_ARTICLES](state, list) {
      state.list = list;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 