import { API_URL, PHOTO_ACTION_PATH } from '@/config';
import { isEmptyObject } from './helper';

export const scrollToTop = () => {
   let element = document.getElementById('app');
   if(!element) return;

   element.scrollIntoView();
}

export const resolveErrorData = (error) => {
   console.log(error);
   if(error) {
      if(error.status && error.status === 400) return error.data;
   }
   return null; 
}

export const onError = (error) => {
   console.log(error);
   Bus.$emit('errors');
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
   let url = `${API_URL}${PHOTO_ACTION_PATH}`;
   let params = { name };
   if(width) params['width'] = width;
   if(height) params['height'] = height;
   if(type) params['type'] = type;
  
   return buildQuery(url, params);
}

export const photoIdUrl = (id, width = 0, height = 0, type = '') => {
   let url = `${API_URL}${PHOTO_ACTION_PATH}/${id}`;
   let params = {};
   if(width) params['width'] = width;
   if(height) params['height'] = height;
   if(type) params['type'] = type;
  
   return buildQuery(url, params);
}

export const hasIntersection = (arrA, arrB) => arrA.some((val) => arrB.indexOf(val) !== -1);

export const noIntersection = (arrA, arrB) => !hasIntersection(arrA, arrB);

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const uuid = (len = 8, radix = 16) => {
   let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
   let uuid = [], i;
   radix = radix || chars.length;

   if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
   }else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
         if (!uuid[i]) {
            r = 0 | Math.random()*16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
         }
      }
   }

   return uuid.join('');
}



export * from './user';
export * from './format';
export * from './helper';
export * from './subject';
export * from './highlight';
export * from './reference';
export * from './recruit';
export * from './validator';