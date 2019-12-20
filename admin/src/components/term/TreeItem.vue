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
		max_width: {
         type: Number,
         default: 800
      },
   },
   methods: {
      getContent() {
         if(!this.item) return '';
         return this.item.fullText.replace(/<br>/g, `<br><span style="padding-left:15px"></span>`);
      }
   }
}
</script>

<style scoped>
.term-text {
   font-size: 16px;
}
</style>