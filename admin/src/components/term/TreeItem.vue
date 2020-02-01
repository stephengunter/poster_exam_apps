<template>
   <div class="term-text" :style="{ 'max-width': `${max_width}px` }" v-html="getContent()">
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
          
         return content.replace(/<br>/g, `<br><span style="padding-left:15px"></span>`);
      }
   }
}
</script>

<style scoped>
.term-text {
   font-size: 16px;
}
</style>