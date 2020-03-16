<template>
   <div :style="{ 'padding-top': index > 0 ? '1em' : '' }">
      <p v-if="model.title">{{ model.title }}</p>
     
      <core-highlight :queries="model.highlights" :content="model.text" />
   </div>
</template>

<script>
export default {
   name: 'SourceItem',
   props: {
      index: {
         type: Number,
         default: 0
      },
      model: {
         type: Object,
         default: null
      }
   }
}
</script>