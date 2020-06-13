import { SHOW_MANUAL } from '@/store/actions.type';
import { POST_TYPES } from '@/consts';
import { photoNameUrl } from './photo';

export const convertHtmlContent = (text, maxWidth) => {
   console.log('convertHtmlContent', maxWidth);
   if(!text) return '';

   let result = text;
   let matches = text.match(/<UPLOADPHOTO>(.*?)<\/UPLOADPHOTO>/g);
   if(!matches) return result;
   
   for(let i = 0; i < matches.length; i++) {
      let name = matches[i].replace(/<\/?UPLOADPHOTO>/g, '');
      if(!name) continue;

      let isEmoji = name.split('/')[0].toLowerCase() === POST_TYPES.EMOJI.toLowerCase();
      
      let photoUrl = photoNameUrl(name, maxWidth);
      
      //result = result.replace(matches[i], `<a href="#" style="display: block" onclick="event.preventDefault(); ${SHOW_PHOTO}(${id});">&#128247;查看圖片</a>`)
      result = isEmoji ? 
               result.replace(matches[i], `<img src="${photoUrl}" class="inline-emoji">`) :
               result.replace(matches[i], `<img src="${photoUrl}">`);
               
   }

   let manualMatches = result.match(/<MANUAL>(.*?)<\/MANUAL>/g);
   if(manualMatches) {
      
      for(let i = 0; i < manualMatches.length; i++) {
         let content = manualMatches[i].replace(/<\/?MANUAL>/g, '');
         if(!content) continue;
         let link = { text: content.split(',')[0], id: content.split(',')[1] };
         result = result.replace(manualMatches[i], `<a href="#" onclick="event.preventDefault(); ${SHOW_MANUAL}(${link.id});">${link.text}</a>`);
      }
   }

   return result;
}