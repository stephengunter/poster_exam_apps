import { API_URL } from '@/config';
import { buildQuery } from './query';

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