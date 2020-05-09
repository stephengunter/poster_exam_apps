var path = require('path');
var dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath});

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

export const apiUrl = () => process.env.API_URL;

export const isDevelopment = () => process.env.ENV.toLowerCase() === 'development';

export const getToken = () => process.env.TOKEN;

export * from './helper';

