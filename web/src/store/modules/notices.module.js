import NoticesService from '@/services/notices.service';

import { FETCH_NOTICES, NOTICE_DETAILS} from '@/store/actions.type';

import { SET_NOTICES_PARAMS, SET_LOADING, SET_NOTICES } from '@/store/mutations.type';



const initialState = {
   params: null,
   list: [],
   pagedList: null,   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_NOTICES](context, params) {
      context.commit(SET_LOADING, true);
      context.commit(SET_NOTICES_PARAMS, params);
      return new Promise((resolve, reject) => {
         NoticesService.fetch(params)
            .then(model => {
               context.commit(SET_NOTICES, model);
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
   [NOTICE_DETAILS](context, { id, user }) {
      return new Promise((resolve, reject) => {
         NoticesService.details({ id, user })
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
   [SET_NOTICES_PARAMS](state, params) {
      state.params = params;
   },
   [SET_NOTICES](state, pagedList) {
      state.pagedList = pagedList;

      let viewList = pagedList.viewList;
      if(viewList && viewList.length) {
         state.list = state.list.concat(viewList);
      }
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 