import SubscribesService from '@/services/subscribes.service';
import PlansService from '@/services/plans.service';
import { resolveErrorData } from '@/utils';

import { SUBSCRIBES_INDEX, FETCH_PLANS, CREATE_SUBSCRIBE, 
   STORE_SUBSCRIBE
} from '@/store/actions.type';

import { SET_LOADING, SET_PLAN, SET_CURRENT_SUBSCRIBE, SET_BILLS,
SET_SUBSCRIBE_RECORDS, SET_PAYWAYS, SET_CAN_CREATE_SUBSCRIBE } from '@/store/mutations.type';

const initialState = {
   current: null,
   bills: [],
   records: [],
   
   plan: null,
   payWays: [],
   canCreate: false
};

export const state = { ...initialState };
 
const getters = {
   currentSubscribe(state) {
      return state.current;
   },
   plan(state) {
      return state.plan;
   },
   payWays(state) {
      return state.payWays;
   }
};

const actions = {
   [SUBSCRIBES_INDEX](context) {
      return new Promise((resolve, reject) => {
         SubscribesService.index()
         .then(model => {
            context.commit(SET_CURRENT_SUBSCRIBE, model.current);
            context.commit(SET_BILLS, model.bills);
            context.commit(SET_SUBSCRIBE_RECORDS, model.records);
              
            context.commit(SET_PLAN, model.plan);
            context.commit(SET_PAYWAYS, model.payWays);
            context.commit(SET_CAN_CREATE_SUBSCRIBE, model.canCreate);
            resolve(model.plan);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
      });
   },
   [FETCH_PLANS](context) {
      return new Promise((resolve, reject) => {
         PlansService.fetch()
         .then(plan => {  
            context.commit(SET_PLAN, plan);
            resolve(plan);
         })
         .catch(error => {
            reject(error);
         })
      });
   },
   [CREATE_SUBSCRIBE](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubscribesService.create()
         .then(model => {
            resolve(model);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [STORE_SUBSCRIBE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SubscribesService.store(model)
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
   [SET_CURRENT_SUBSCRIBE](state, model) {
      state.current = model;
   },
   [SET_BILLS](state, bills) {
      state.bills = bills;
   },
   [SET_SUBSCRIBE_RECORDS](state, records) {
      state.records = records;
   },
   [SET_PLAN](state, plan) {
      if(plan) state.plan = plan;
      else state.plan = null;  
   },
   [SET_PAYWAYS](state, payWays) {
      state.payWays = payWays;
   },
   [SET_CAN_CREATE_SUBSCRIBE](state, val) {
      state.canCreate = val;
   },
};

export default {
   state,
   actions,
   mutations,
   getters
};
 