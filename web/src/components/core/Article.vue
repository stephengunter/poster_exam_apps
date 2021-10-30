<template>
   <article v-html="content">

   </article>
</template>

<script>
import { photoNameUrl } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';
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
      this.content = this.convert(this.text);
   },
   methods: {
      convert(text) {
         let result = text;
         let matches = text.match(/<UPLOADPHOTO>(.*?)<\/UPLOADPHOTO>/g);
         if(!matches) return result;
         
         for(let i = 0; i < matches.length; i++) {
            let name = matches[i].replace(/<\/?UPLOADPHOTO>/g, '');
            let photoUrl = photoNameUrl(name, DIALOG_MAX_WIDTH);
            //result = result.replace(matches[i], `<a href="#" style="display: block" onclick="event.preventDefault(); ${SHOW_PHOTO}(${id});">&#128247;查看圖片</a>`)
            result = result.replace(matches[i], `<img src="${photoUrl}">`);
         }
         return result;
      }
   }
}
</script>

<style>

</style>