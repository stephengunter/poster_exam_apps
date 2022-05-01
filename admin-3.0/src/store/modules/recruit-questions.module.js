import RecruitQuestionsService from '@/services/recruit-questions.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_RECRUIT_QUESTIONS
} from '@/store/actions.type';

import { SET_QUESTIONS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_RECRUIT_QUESTIONS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RecruitQuestionsService.fetch(params)
            .then(questions => {
               context.commit(SET_QUESTIONS, questions);
               resolve(questions);
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
 