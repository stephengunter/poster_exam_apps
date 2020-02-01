import NotesService from '@/services/notes.service';
import { resolveErrorData } from '@/utils';

import {
   FETCH_NOTES, STORE_NOTE, UPDATE_NOTE, DELETE_NOTE
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
   },
   [STORE_NOTE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NotesService.store(model)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [UPDATE_NOTE](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NotesService.update(model.id, model)
            .then(() => {
               resolve(true);
            })
            .catch(error => {
               reject(resolveErrorData(error)); 
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [DELETE_NOTE](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NotesService.remove(id)
            .then(() => {
               resolve(true);
            })
            .catch(error => {
               reject(resolveErrorData(error));
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
};


const mutations = {
   
};

export default {
   state,
   actions,
   mutations,
   getters
};
 