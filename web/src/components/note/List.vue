<template>
<div>
   <div class="mt-1">
      <v-row v-if="!term.hide" v-show="show_term">
         <v-col cols="12">
            <term-read :term="term" />
         </v-col>
      </v-row>
      <v-card v-if="term.notes.length">
         <v-card-text>
            <note-item  v-for="(note, index) in activeNotes" :key="index"
            :model="note"
            @show-photo="showPhoto"
            />
         </v-card-text>
      </v-card>
   </div>
</div>	
				
</template>

<script>
export default {
   name: 'NoteList',
   props: {
      show_term: {
         type: Boolean,
         default: true
      },
      term: {
         type: Object,
         default: null
      },
      max_width: {
         type: Number,
         default: 800
      }
   },
   computed: {
      activeNotes() {
         if(this.term) return this.term.notes.filter(item => item.active);
         else return [];
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