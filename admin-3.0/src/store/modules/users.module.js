import UsersService from '@/services/users.service';
import { resolveErrorData } from '@/utils';

import { FETCH_USERS } from '@/store/actions.type';

import { SET_USERS, SET_ROLE_OPTIONS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   pagedList: null,
   roleOptions: []
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
               if(model.rolesOptions.length) context.commit(SET_ROLE_OPTIONS, model.rolesOptions);
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
   [SET_USERS](state, model) {
      state.pagedList = model;
   },
   [SET_ROLE_OPTIONS](state, options) {
      state.roleOptions = options;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 