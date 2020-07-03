import Vue from 'vue';
import { photoNameUrl,  photoIdUrl } from '@/utils';

Vue.filter('photoNameUrl', (name, width = 0, height = 0, type = '') => {
   return photoNameUrl(name, width, height, type);
});

Vue.filter('photoIdUrl', (id, width = 0, height = 0, type = '') => {
   return photoIdUrl(id, width, height, type);
});

Vue.filter('resolvesText', (resolves) => {
   if(!resolves.length) return '解析 (0)';
   let reviewed = resolves.filter(item => item.reviewed);
   return ` 解析 (${reviewed.length}, ${resolves.length - reviewed.length}) `
});

// Vue.filter('highlight', function(words, query){
//    var iQuery = new RegExp(query, "ig");
//    return words.toString().replace(iQuery, function(matchedTxt,a,b){
//        return ('<span class=\'text__highlight\'>' + matchedTxt + '</span>');
//    });
// });