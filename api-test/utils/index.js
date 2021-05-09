import jwtDecode from 'jwt-decode';
import moment from 'moment';
var path = require('path');
var dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath});

const ACTIONS_KEY = 'actions';

export const SUBSCRIBER = 'Subscriber';

export const API_URL = process.env.API_URL;

export const ADMIN_USER = process.env.ADMIN_USER;

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;


export const initState = () => global.state = {};

export const getState = (key) => {
   if(key) return global.state[key];
   else return global.state;
}

export const setState = (key, val) => {
   let state = { ...global.state };
   state[key] = val;

   global.state = state;
}

export const addAction = (action) => {
   let actions = getActions();
   if(actions && actions.length) {
      actions.push(action);
   }else {
      actions = [action];
   }
   setState(ACTIONS_KEY, actions);
}

export const getActions = () => getState(ACTIONS_KEY);

export const setToken = (token) => setState('token', token);

export const getToken = () => getState('token');

export const getClaims = () => {
   let token = getToken();
   if(token) return jwtDecode(token);
   return null; 
}

export const isSubscriber = (claims) => {
   let roles = claims.roles ? claims.roles.split(',') : [];
   if(!roles.length) return false;
   return roles.includes(SUBSCRIBER);
}


export const getAdminRequestModel = (cmd, data = '') => ({ key: process.env.ADMIN_KEY, cmd, data });

export const isDevelopment = () => process.env.ENV.toLowerCase() === 'development';


export const getNowText = () => moment().format('YYYY-MM-DD HH:mm:ss');

export * from './helper';
export * from './pays';

