import { API_URL } from '@/config';
import { isEmptyObject } from './helper';

export const resolveErrorData = (error) => {
   console.log(error);
   if(!error) return null;
   
   if(error.status && error.status === 400) return error.data;
   return error; 
}


export const onError = (error) => {
   Bus.$emit('errors', error);
}

export const showConfirm = ({ type, title, text, ok ='確定', cancel = '取消', onOk = null, onCancel = null,maxWidth = 0}) => {
  Bus.$emit('show-confirm', { type, title, text, ok, cancel, onOk, onCancel });
}

export const activeOptions = () => {
   return [{
      value: true,
      text: '上架中'
   },{
      value: false,
      text: '已下架'
   }];
}



export const buildQuery = (url, params) => {
   if(!params || isEmptyObject(params)) return url;
   url += '?';
   for (let field in params) {
      let value = params[field];
      url += `${field}=${value}&`;
   }
   return url.substr(0, url.length - 1);
}


export const photoNameUrl = (name, width = 0, height = 0, type = '') => {
   let url = `${API_URL}/photo`;
   let params = { name };
   if(width) params['width'] = width;
   if(height) params['height'] = height;
   if(type) params['type'] = type;
  
   return buildQuery(url, params);
}

export const photoIdUrl = (id, width = 0, height = 0, type = '') => {
   let url = `${API_URL}/photo/${id}`;
   let params = {};
   if(width) params['width'] = width;
   if(height) params['height'] = height;
   if(type) params['type'] = type;
  
   return buildQuery(url, params);
}

export * from './helper';
export * from './route';
export * from './actions';
export * from './exam';
export * from './highlight';