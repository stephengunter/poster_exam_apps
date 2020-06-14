import NotesService from '@/services/notes.service';

import { FETCH_NOTE_CATEGORIES, FETCH_NOTES, NOTE_DETAILS } from '@/store/actions.type';

import { SET_LOADING, SET_NOTE_CATEGORIES, SET_NOTES } from '@/store/mutations.type';



const initialState = {
   categories: [],

   allSubjects: [],
   subjectOptions: [],
   allTerms: [],

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
   [NOTE_DETAILS](context, id) {
      return new Promise((resolve, reject) => {
         NotesService.details(id)
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
   [SET_NOTE_CATEGORIES](state, categories) {
      if(categories && categories.length) {
         state.categories = categories;
         state.subjectOptions = categories.map(item => ({ value: item.id, text: item.text }));
         
         let subjects = categories.flatMap(item => item.subItems);
         let allTerms = subjects.flatMap(item => item.subItems);
         state.allSubjects = subjects;
			state.allTerms = allTerms;
      }else {
         state.categories = [];
      } 
      
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
 