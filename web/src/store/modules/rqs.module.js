import RQService from '@/services/rqs.service';
import { toCnNumber } from '@/utils';

import { FETCH_RQS } from '@/store/actions.type';
import { SET_RQS, SET_LOADING } from '@/store/mutations.type';

const initialState = {
   parts: []
};

export const state = { ...initialState };
 
const getters = {
   
};

const loadPartData = (model) => {
   let multiParts = model.parts.length > 1;
   for(let i = 0; i < model.parts.length; i++) {
      let part = model.parts[i];
      let questionCount = part.questions.totalItems;
      let pointsPerQuestion = questionCount ? (part.points / questionCount) : 0;
      console.log('pointsPerQuestion', pointsPerQuestion);
      if(multiParts) {
         let title = `第${toCnNumber(i + 1)}部份 - 共 ${questionCount} 題 每題 ${pointsPerQuestion} 分`;
         part.title = title;
      }else {
         part.title = `共 ${questionCount} 題 每題 ${pointsPerQuestion} 分`;
      }
   }
}

const actions = {
   [FETCH_RQS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RQService.fetch(params)
         .then(model => {
            loadPartData(model);
            context.commit(SET_RQS, model.parts);
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
   [SET_RQS](state, parts) {
      state.parts = parts;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 