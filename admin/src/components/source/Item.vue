<template>
   <div>
      <span v-if="model.title">{{ model.title }}</span>
     
      <core-highlight :queries="model.highlights" :content="model.text" />
   </div>
</template>

<script>
export default {
   name: 'SourceItem',
   props: {
      model: {
         type: Object,
         default: null
      }
   }
}
</script>