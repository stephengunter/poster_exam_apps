import NotesService from '@/services/notes.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_NOTES
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   list: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_NOTES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NotesService.fetch(params)
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
 