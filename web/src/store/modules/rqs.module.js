import RQService from '@/services/rqs.service';
import { toCnNumber } from '@/utils';

import { FETCH_RQS } from '@/store/actions.type';
import { SET_RQS, SET_RQS_EXAM, SET_LOADING } from '@/store/mutations.type';

const initialState = {
   parts: [],
   exam: null
};

export const state = { ...initialState };
 
const getters = {
   
};

const isExamMode = (params) =>  params.mode === 1;

const loadPartData = (model) => {
   let parts = model.parts;
   let multiParts = parts.length > 1;
   for(let i = 0; i < parts.length; i++) {
      let part = parts[i];
      let questionCount = part.questions.length;
      let pointsPerQuestion = questionCount ? (part.points / questionCount) : 0;
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
            if(isExamMode(params)) {
               context.commit(SET_RQS_EXAM, model);
               context.commit(SET_RQS, []);
            }else {
               context.commit(SET_RQS, model.parts);
               context.commit(SET_RQS_EXAM, null);
            }
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
   },
   [SET_RQS_EXAM](state, exam) {
      state.exam = exam;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 