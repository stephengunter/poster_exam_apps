<template>
   <span class="term-text" :style="{ 'max-width': `${max_width}px` }" v-html="getContent()">
   </span>
</template>

<script>

export default {
   name: 'TermTreeItem',
   props: {
      content: {
         type: String,
         default: ''
      },
		max_width: {
         type: Number,
         default: 800
      },
   },
   methods: {
      getContent() {
         return this.content.replace(/<br>/g, `<br><span style="padding-left:15px"></span>`);
      }
   }
}
</script>

<style scoped>
.term-text {
   font-size: 16px;
}
</style>