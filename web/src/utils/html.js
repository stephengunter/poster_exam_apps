import { SHOW_MANUAL, NOTE_CATEGORY } from '@/store/actions.type';
import { POST_TYPES } from '@/consts';
import { photoNameUrl } from './photo';

export const convertHtmlContent = (text, maxWidth) => {
   if(!text) return '';

   let result = text;

   result = convertUploadPhoto(result, maxWidth);

   result = convertManualLink(result);

   result = convertCategoryLink(result);

   return result;
}


const convertUploadPhoto = (text, maxWidth) => {
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

   return result;
}

const convertManualLink = (text) => {
   let result = text;

   let matches = result.match(/<MANUAL>(.*?)<\/MANUAL>/g);
   if(!matches) return result;

   for(let i = 0; i < matches.length; i++) {
      let content = matches[i].replace(/<\/?MANUAL>/g, '');
      if(!content) continue;
      let link = { text: content.split(',')[0], id: content.split(',')[1] };
      result = result.replace(matches[i], `<a href="#" onclick="event.preventDefault(); ${SHOW_MANUAL}(${link.id});">${link.text}</a>`);
   }

   return result;   
}

const convertCategoryLink = (text) => {
   let result = text;

   let matches = result.match(/<NOTECATEGORIES>(.*?)<\/NOTECATEGORIES>/g);
   if(!matches) return result;

   for(let i = 0; i < matches.length; i++) {
      let content = matches[i].replace(/<\/?NOTECATEGORIES>/g, '');
      if(!content) continue;
      
      result = result.replace(matches[i], `<a href="#" onclick="event.preventDefault(); ${NOTE_CATEGORY}();">${content}</a>`);
   }

   return result;   
}