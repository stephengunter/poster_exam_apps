import SubscribesService from '@/services/subscribes.service';
import PlansService from '@/services/plans.service';
import { resolveErrorData } from '@/utils';

import { SUBSCRIBES_INDEX, FETCH_PLANS
} from '@/store/actions.type';

import { SET_LOADING, SET_PLAN, SET_CURRENT_SUBSCRIBE, 
SET_SUBSCRIBE_RECORDS, SET_PAYWAYS } from '@/store/mutations.type';

const initialState = {
   records: [],
   current: null,
   plan: null,
   payWays: []
   
};

export const state = { ...initialState };
 
const getters = {
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
               context.commit(SET_SUBSCRIBE_RECORDS, model.records);
               context.commit(SET_CURRENT_SUBSCRIBE, model.current);   
               context.commit(SET_PLAN, model.plan);
               context.commit(SET_PAYWAYS, model.payWays);
               resolve(model.plan);
            })
            .catch(error => {
               reject(error);
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
   }
   
};


const mutations = {
   [SET_PLAN](state, plan) {
      state.plan = plan;
   },
   [SET_PAYWAYS](state, payWays) {
      state.payWays = payWays;
   },
   [SET_SUBSCRIBE_RECORDS](state, records) {
      state.records = records;
   },
   [SET_CURRENT_SUBSCRIBE](state, model) {
      state.current = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 