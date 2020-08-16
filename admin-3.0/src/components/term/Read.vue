<template>
   <span v-html="html"></span>
</template>

<script>
import { highlightChunks } from '@/utils';
export default {
   props: {
      term: {
         type: Object,
         default: null
      }
   },
   data() {
      return {
         html: '',
         reference: {
            textList: []
         }
      }
   },
   beforeMount() {
      this.init();
   },
   methods: {
      init() {
         let text = this.term.fullText;

         if(!text) {
            this.html = '';
            return;
         }
         let queries = this.term.highlights;
         if(this.term.references.length) this.reference.textList = this.term.references.map(item => item.text);


         let caseSensitive = false;
         let diacriticsSensitive = false;

         let highlights = highlightChunks(text, queries, { caseSensitive, diacriticsSensitive });
         this.render(highlights);
      },
      isReference(text) {
         if(this.reference.textList.length) return  this.reference.textList.includes(text);
         return false;
      },
      referenceTag(text) {
         let reference = this.term.references.find(item => item.text === text);
         if(reference) {
            if(reference.type.toLowerCase() === 'note') {
               return `<a href="#" onclick="event.preventDefault(); showNote(${reference.id});" >${text}</a>`;
            }else {
               return `<a href="#" onclick="event.preventDefault(); showTerm(${reference.id});" >${text}</a>`;
            }
         }else return text;
      },
      render(highlights) {        
        
         let htmls = highlights.map(item => {
            if(item.isHighlighted) return `<mark class="text__highlight">${item.text}</mark>`;
            else return item.text;
         });
        
         this.html = htmls.join('');

         this.reference.textList.forEach(text => {
            this.html = this.html.replace(text, this.referenceTag(text))
         });
         
      }
   }
}
</script>