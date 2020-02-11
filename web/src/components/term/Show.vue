<template>
   <v-card v-if="model">
      <core-close-icon-button @close="cancel" />
      <v-card-title>
         {{ model.subject.title }}  {{ model.title }}
      </v-card-title>
      <v-card-text>
         <term-tree-item :content="model.text" 
         :max_width="max_width" 
         />
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'ShowPhoto',
   props: {
      model: {
         type: Object,
         default: null
      },
      max_width: {
         type: Number,
         default: 0
      },
   },
   methods: {
      cancel() {
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>