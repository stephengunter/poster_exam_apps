<template>
   <div class="term-text" :style="{ 'max-width': `${max_width}px` }" v-html="item.fullText">
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
   }
}
</script>

<style scoped>
.term-text {
   font-size: 16px;
}
</style>