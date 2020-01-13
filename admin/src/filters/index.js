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

Vue.filter('photoIdUrl', (id, width = 0, height = 0, type = '') => {
   let url = `${SITE_URL}/api/photo/${id}`;
   let params = {};
   if(width) params['width'] = width;
   if(height) params['height'] = height;
   if(type) params['type'] = type;
  
   return buildQuery(url, params);
});

Vue.filter('resolvesText', (resolves) => {
   if(!resolves.length) return '解析 (0)';
   let reviewed = resolves.filter(item => item.reviewed);
   return ` 解析 (${reviewed.length}, ${resolves.length - reviewed.length}) `
});

Vue.filter('highlight', function(words, query){
   var iQuery = new RegExp(query, "ig");
   return words.toString().replace(iQuery, function(matchedTxt,a,b){
       return ('<span class=\'text__highlight\'>' + matchedTxt + '</span>');
   });
});