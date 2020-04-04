<template>
   <v-card>
      <core-close-icon-button @close="cancel" />
      <v-card-title v-if="model.title">
         {{ model.title }}
      </v-card-title>
      <v-card-text>
        <note-content :model="model"/>
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'NoteShow',
   props: {
      model: {
         type: Object,
         default: null
      }
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