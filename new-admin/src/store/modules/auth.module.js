import jwtDecode from 'jwt-decode';
import Errors from '@/common/errors';
import BaseService from '@/common/baseService';

import AuthService from '@/services/auth.service';
import OAuthService from '@/services/oAuth.service';
import JwtService from '@/services/jwt.service';
import { GOOGLE_AUTH_PARAMS } from '@/config';
import GoogleAuth from '@/common/googleAuth';
import { isAdmin } from '@/utils';


import {
   CHECK_AUTH,
   REFRESH_TOKEN,
   LOGIN,
   INIT_GOOGLE_SIGNIN,
   GOOGLE_SIGNIN,
   LOGOUT
} from '../actions.type';

import { SET_AUTH, PURGE_AUTH, SET_USER, 
   SET_ERROR, CLEAR_ERROR, SET_LOADING 
} from '../mutations.type';

 
const state = {
   errors: new Errors(),
   user: null,
   isAuthenticated: !!JwtService.getToken()
};

const getters = {
   currentUser(state) {
     return state.user;
   },
   isAuthenticated(state) {
     return state.isAuthenticated;
   }
};

const resolveUserFromToken = (token) => {
   let claims = jwtDecode(token);
   return {
      id: claims.id,
      email: claims.sub,
      picture: claims.picture,
      name: claims.name,
      roles: claims.roles ? claims.roles.split(',') : []
   };
}

const actions = {
   [INIT_GOOGLE_SIGNIN](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         GoogleAuth.load(GOOGLE_AUTH_PARAMS).then(auth2 => {
            resolve({
               signedIn: auth2.isSignedIn.get()
            });		
         })
         .catch(err => {
            reject(err);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });     
   },
   [GOOGLE_SIGNIN](context) {
      return new Promise((resolve, reject) => {
         GoogleAuth.signIn()
         .then(googleUser => {
            resolve(googleUser.getAuthResponse().id_token);
         })
         .catch(err => {
            reject(err);
         })    
      });
       
   },
   [LOGIN](context, token) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         OAuthService.googleLogin(token)
         .then(model => {
            context.commit(SET_AUTH, {
               token: model.accessToken.token,
               refreshToken: model.refreshToken
            }); 
            resolve(null);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });     
   },
   [LOGOUT](context) {
      context.commit(PURGE_AUTH);
      return new Promise((resolve) => {
         setTimeout(() => {
            resolve(true);
         }, 500)
      }); 
   },
   [CHECK_AUTH](context) {
      return new Promise((resolve) => {
         let token = JwtService.getToken();
         if (token) {
            let user = context.state.user;
            if(!user) {
               user = resolveUserFromToken(token);
               context.commit(SET_USER, user);
            }
            
            if(isAdmin(user)){
               BaseService.setHeader(token);
               resolve(true);
            }else{
               context.commit(PURGE_AUTH);
               resolve(false);
            }            
         }else {
            context.commit(PURGE_AUTH);
            resolve(false);
         }
      });
   },
   [REFRESH_TOKEN](context) {
      return new Promise((resolve) => {
         let accessToken = JwtService.getToken();
         let refreshToken = JwtService.getRefreshToken();
         if(accessToken && refreshToken) {
            context.commit(SET_LOADING, true);
            AuthService.refreshToken({ accessToken, refreshToken })
            .then(model => {
               context.commit(SET_AUTH, {
                  token: model.accessToken.token,
                  refreshToken: model.refreshToken
               });
               context.commit(SET_LOADING, false);
               resolve(true);
            })
            .catch(err => {
               context.commit(SET_LOADING, false);
               context.commit(PURGE_AUTH);
               resolve(false);           
            })
         }else {
            context.commit(PURGE_AUTH);
            resolve(false);
         }
      });
   }
};


const mutations = {
   [SET_ERROR](state, errors) {
      state.errors.record(errors);
   },
   [CLEAR_ERROR](state) {
      state.errors.clear();   
   },
   [SET_USER](state, user) {
      if(user) state.user = user;
      else state.user = null;
   },
   [SET_AUTH](state, model) {
      JwtService.saveToken(model.token, model.refreshToken);

      state.user = resolveUserFromToken(model.token);
      state.isAuthenticated = true;
   },
   [PURGE_AUTH](state) {
      state.isAuthenticated = false;
      state.user = null;

      JwtService.destroyToken();
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 