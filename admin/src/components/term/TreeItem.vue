<template>
   <div :style="{ 'max-width': `${max_width}px` }"  style="display:inline-block;">
     
      <p >
         <v-icon v-if="item.chapterTitle && item.hide">mdi-close</v-icon>
         <span style="font-size:16px"  v-html="getContent()"></span>
      </p>
     
   </div>
</template>

<script>

export default {
   name: 'TermTreeItem',
   props: {
      item: {
         type: Object,
         default: null
      },
      show_subject: {
         type: Boolean,
         default: false
      },
      show_title: {
         type: Boolean,
         default: true
      },
		max_width: {
         type: Number,
         default: 800
      },
   },
   methods: {
      getContent() {
         if(!this.item) return '';
         let item = this.item;         
        
         let content = item.text ? item.text : '';
         if(this.show_title) {
            let title = this.show_subject ? `${item.subject.title} ${item.title}` : item.title;
            if(content) content = title + ' ' + content;
            else content = title;            
         }

         content = content.replace(/<br>/g, `<br><span style="padding-left:15px"></span>`);
         
         //content += '<v-icon>mdi-close</v-icon>';
         return content;
      }
   }
}
</script>
