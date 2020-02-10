import NotesService from '@/services/notes.service';
import { resolveErrorData } from '@/utils';

import { FETCH_NOTE_CATEGORIES,
   FETCH_NOTES, STORE_NOTE, UPDATE_NOTE, DELETE_NOTE
} from '@/store/actions.type';

import { SET_LOADING, SET_NOTE_CATEGORIES, SET_NOTES } from '@/store/mutations.type';



const initialState = {
   categories: [],
   terms: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_NOTE_CATEGORIES](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NotesService.categories()
            .then(categories => {
               context.commit(SET_NOTE_CATEGORIES, categories);
               resolve(categories);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [FETCH_NOTES](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         NotesService.fetch(params)
            .then(terms => {
               context.commit(SET_NOTES, terms);
               resolve(terms);
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
   [SET_NOTE_CATEGORIES](state, categories) {
      state.categories = categories;
   },
   [SET_NOTES](state, terms) {
      state.terms = terms;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 