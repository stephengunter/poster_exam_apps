import AttachmentService from '@/services/attachments.service';
import { resolveErrorData } from '@/utils';

import { STORE_ATTACHMENT } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [STORE_ATTACHMENT](context, { postType, postId, files }) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         let form = new FormData();
         form.append('postType', postType);
         form.append('postId', postId);
         for (let i = 0; i < files.length; i++) {
            form.append('files', files[i]); 
         }
         AttachmentService.store(form)
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
 