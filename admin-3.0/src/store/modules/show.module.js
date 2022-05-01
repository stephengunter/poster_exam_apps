import TermsService from '@/services/terms.service';
import NotesService from '@/services/notes.service';
import { SHOW_TERM, SHOW_NOTE } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';

const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [SHOW_NOTE](context, id) {
      context.commit(SET_LOADING, true);
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
         })
      });
      
   },
   [SHOW_TERM](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         TermsService.details(id)
         .then(model => {
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         })
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
 