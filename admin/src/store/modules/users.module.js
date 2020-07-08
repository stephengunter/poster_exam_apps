import UsersService from '@/services/users.service';
import { resolveErrorData } from '@/utils';
import { FETCH_USERS, USER_DETAILS, ADD_USER_PASSWORD } from '@/store/actions.type';
import { SET_USERS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   pageList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_USERS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         UsersService.fetch(params)
            .then(model => {
               context.commit(SET_USERS, model.pagedList);
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
   [USER_DETAILS](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         UsersService.details(id)
            .then(user => {
               resolve(user);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [ADD_USER_PASSWORD](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         UsersService.addPassword(model)
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
   [SET_USERS](state, model) {
      state.pageList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 