import QuestionsService from '@/services/questions.service';

import { FETCH_QUESTIONS } from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
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
 