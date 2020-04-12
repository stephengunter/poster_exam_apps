import RQService from '@/services/rqs.service';

import { FETCH_RQS } from '@/store/actions.type';
import { SET_RQS_MODEL, INIT_RQS_PAGE, SET_RQS_PAGE_MODE,
   SET_LOADING
} from '@/store/mutations.type';

const initialState = {
   mode: null,
   modeOptions: [],
   subjectOptions: [],
   yearRecruits: [],
   model: null
};

export const state = { ...initialState };
 
const getters = {
   rqReadMode(state) {
      return state.mode && state.mode.value === 0;
   },
   rqExamMode(state) {
      return state.mode && state.mode.value === 1;
   }
};


const actions = {
   [FETCH_RQS](context, params) {
      let firstLoad = params.mode < 0;
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         RQService.fetch(params)
         .then(model => {
            if(firstLoad) {
               context.commit(INIT_RQS_PAGE, model);
            }else if(model.parts) {
               let index = 1;
               model.parts.forEach(part => {
                  part.questions.forEach(question => {
                     question.index = index;
                     index += 1;
                  })
               });
               context.commit(SET_RQS_MODEL, model);
            }
            resolve(model);
         })
         .catch(error => {
            context.commit(SET_RQS_MODEL, null);
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
   
};


const mutations = {
   [INIT_RQS_PAGE](state, indexModel) {
      state.yearRecruits = indexModel.yearRecruits;
      state.subjectOptions = indexModel.subjectOptions;
      state.modeOptions = indexModel.modeOptions;
   },
   [SET_RQS_MODEL](state, model) {
      state.model = model;
   },
   [SET_RQS_PAGE_MODE](state, val) {
      if(val) {
         let mode = state.modeOptions.find(item => item.value === val);
         state.mode = mode ? mode : state.modeOptions[0];
      }else state.mode = state.modeOptions[0];
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 