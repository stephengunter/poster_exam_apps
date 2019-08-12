import AuthService from '@/services/auth.service';
import BaseService from '@/common/baseService';

const authService = new AuthService();

import {
   LOGIN, LOGOUT, CHECK_AUTH, SIGNIN_CALLBACK
} from '@/store/actions.type';

import { PURGE_AUTH, SET_USER
} from '@/store/mutations.type';

 
const state = {
   user: null
};

const getters = {
   currentUser(state) {
      return state.user;
   }
};

const resolveUser = (user) => {
   let profile = user.profile;
   let role = user.profile.role;

   let fundsList = role[1].split('-')[1];
   let clientId = role[2].split('-')[1];
   let masterFundId= role[3].split('-')[1];

   return {
      email: profile.email,
      role: role[0],
      clientId: clientId,
      fundsList: JSON.parse(fundsList),
      masterFundId: masterFundId
   };
}

const actions = {
   [LOGIN]() {
      authService.signin();
   },
   [LOGOUT](context) {
      return new Promise((resolve) => {
         authService.signout();         
         resolve(true);
      });
     	
   },
   [CHECK_AUTH](context) {
      return new Promise((resolve) => {
         if(authService.isAuthenticated()){
            let authUser = authService.getCurrentUser();
            if(authService.isQuantiumAdmin(authUser)){
               BaseService.setHeader(authUser.access_token);
               context.commit(SET_USER, resolveUser(authUser));
               resolve(200); 
            }else{
               resolve(403); 
            }
                    
         }else{
            context.commit(PURGE_AUTH);
            resolve(0);
         }
      });
   },
   [SIGNIN_CALLBACK](context) {
      return new Promise((resolve, reject) => {
         authService.signinRedirectCallback()
         .then(result => {
            if(result) resolve(true);                
            else {
               context.commit(PURGE_AUTH);
               resolve(false);
            }
         })
         .catch(e => {
            context.commit(PURGE_AUTH);
            reject(e);
         })
      });
   },
};


const mutations = {
   [SET_USER](state, user) {
      state.user = user;
   },
   [PURGE_AUTH](state) {
      authService.signout();
      state.user = null;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 