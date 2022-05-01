import AnalysisService from '@/services/analysis.service';

import {
   ANALYSIS_INDEX, RQ_ANALYSIS
} from '@/store/actions.type';

import { SET_LOADING, SET_ANALYSIS_RESULT, SET_ANALYSIS_VIEWS } from '@/store/mutations.type';


const initialState = {
   viewList: [],
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
            .then(model => {
               context.commit(SET_ANALYSIS_RESULT, model.results);
               context.commit(SET_ANALYSIS_VIEWS, model.viewList);
               resolve(true);
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
   },
   [SET_ANALYSIS_VIEWS](state, viewList) {
      state.viewList = viewList;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 