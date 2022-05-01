import PaysService from '@/services/pays.service';
import BillsService from '@/services/bills.service';
import { resolveErrorData } from '@/utils';

import { EDIT_BILL, BILL_DETAILS, BEGIN_PAY
} from '@/store/actions.type';

import { SET_LOADING } from '@/store/mutations.type';

const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
};

const actions = {
   [BEGIN_PAY](context, bill) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         BillsService.update(bill.id, bill)
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
   [EDIT_BILL](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         BillsService.edit(id)
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
   [BILL_DETAILS](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         BillsService.details(id)
         .then(bill => {
            resolve(bill);
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
 