import Vue from 'vue';
import { SITE_URL } from '@/config';
import { buildQuery } from '@/utils';

Vue.filter('photoNameUrl', (name, width = 0, height = 0, type = '') => {
   let url = `${SITE_URL}/api/photo`;
   let params = { name };
   if(width) params['width'] = width;
   if(height) params['height'] = height;
   if(type) params['type'] = type;
  
   return buildQuery(url, params);
});