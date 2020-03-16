import QuestionsService from '@/services/questions.service';

import { FETCH_QUESTIONS } from '@/store/actions.type';

import { SET_LOADING, SET_QUESTIONS } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_QUESTIONS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         QuestionsService.fetch(params)
            .then(questions => {
               for(let i = 0; i < questions.length; i++){
                  questions[i].userAnswerIndexes = [];
               }
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
   [SET_QUESTIONS](state, questions) {
      state.list = questions;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 