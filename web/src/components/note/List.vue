<template>
<div>
   <v-row>
      <v-col cols="12">
         <term-read :term="term" />
      </v-col>
   </v-row>
   <v-card v-if="term.notes.length">
      <v-card-text>
         <note-item  v-for="(note, index) in term.notes" :key="index"
         :model="note"
         @show-photo="showPhoto"
         />
      </v-card-text>
   </v-card>
</div>	
				
</template>

<script>
export default {
   name: 'NoteList',
   props: {
      term: {
         type: Object,
         default: null
      },
      max_width: {
         type: Number,
         default: 800
      }
   },
   methods: {
      showPhoto(item) {
         this.$emit('show-photo', item);
      }
   }
}
</script>

<style>

</style>