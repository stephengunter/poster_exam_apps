<template>
   <a v-if="link" :href="link" target="_blank">{{ text }}</a>
   <span v-else>{{ text }}</span>
</template>

<script>
export default {
   name: 'SourceTag',
   props: {
      text: {
         type: String,
         default: ''
      },
      link: {
         type: String,
         default: ''
      }
   }
}
</script>