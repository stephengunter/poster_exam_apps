<template>
   <article v-html="content">

   </article>
</template>

<script>
import { photoNameUrl, photoIdUrl } from '@/utils';
import { DIALOG_MAX_WIDTH, SITE_URL } from '@/config';
export default {
   name: 'Article',
   props: {
      text: {
         type: String,
         default: ''
		}
   },
   data() {
		return {
			content: ''
		}
	},
   beforeMount() {
      let content = this.convertPhoto(this.text);
      this.content = this.convertSiteLink(content);
   },
   methods: {
      convertPhoto(text) {
         let result = text;
         let matches = text.match(/<UPLOADPHOTO>(.*?)<\/UPLOADPHOTO>/g);
         if(!matches) return result;
         
         for(let i = 0; i < matches.length; i++) {
            let photoUrl = '';
            let args = matches[i].replace(/<\/?UPLOADPHOTO>/g, '');
            let parts = args.split(',');

            if(parts[0].indexOf('.') > -1) {
               photoUrl = photoNameUrl(parts[0], DIALOG_MAX_WIDTH);
            }else {
               photoUrl = photoIdUrl(parts[0], DIALOG_MAX_WIDTH);
            }

            result = result.replace(matches[i], `<img src="${photoUrl}">`);
            //result = result.replace(matches[i], `<a href="#" style="display: block" onclick="event.preventDefault(); ${SHOW_PHOTO}(${id});">&#128247;查看圖片</a>`)
            
         }
         return result;
      },
      convertSiteLink(text) {
         let result = text;
         let matches = text.match(/<SITELINK>(.*?)<\/SITELINK>/g);
         if(!matches) return result;
         
         for(let i = 0; i < matches.length; i++) {
            let args = matches[i].replace(/<\/?SITELINK>/g, '');
            let parts = args.split(',');
            if(parts.length === 2) {
               let url = `${SITE_URL}/${parts[0]}`;
               result = result.replace(matches[i], `<a target="_blank" href="${url}">${parts[1]}</a>`);
            }
            
         }
         return result;
      }
   }
}
</script>

<style>

</style>