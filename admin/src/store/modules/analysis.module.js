import AnalysisService from '@/services/analysis.service';

import {
   QUESTION_ANALYSIS
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';


const initialState = {
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [QUESTION_ANALYSIS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         AnalysisService.fetch(params)
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
};

export default {
   state,
   actions,
   mutations,
   getters
};
 