import AnalysisService from '@/services/analysis.service';

import {
   ANALYSIS_INDEX, RQ_ANALYSIS
} from '@/store/actions.type';

import { SET_LOADING, SET_ANALYSIS_RESULT } from '@/store/mutations.type';


const initialState = {
   results: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [ANALYSIS_INDEX](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         AnalysisService.index()
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
   },
   [RQ_ANALYSIS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         AnalysisService.rq(params)
            .then(results => {
               context.commit(SET_ANALYSIS_RESULT, results);
               resolve(results);
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
   [SET_ANALYSIS_RESULT](state, results) {
      state.results = results;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 