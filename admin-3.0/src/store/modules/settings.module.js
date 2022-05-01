import SettingsService from '@/services/settings.service';
import { resolveErrorData } from '@/utils';

import {
   FIND_EXAM_SETTINGS, SAVE_EXAM_SETTINGS
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';


const initialState = {
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FIND_EXAM_SETTINGS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SettingsService.findExamSettings(params)
            .then(model => {
               resolve(model);
            })
            .catch(error => {
               reject(resolveErrorData(error));
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [SAVE_EXAM_SETTINGS](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         SettingsService.saveExamSettings(model)
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
 