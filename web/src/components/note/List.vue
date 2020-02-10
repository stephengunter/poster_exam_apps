<template>
<div>
   <v-row>
      <v-col cols="12">
         <span class="mr-2" v-text="term.title"></span>
         <core-highlight  :queries="term.highlights" :content="term.text" />
         <!-- <term-tree-item :content="term.text" :max_width="max_width" /> -->
      </v-col>
   </v-row>
   <v-card v-if="term.notes.length">
      <v-card-text>
         <v-row>
            <v-col cols="12" v-for="(note, index) in term.notes" :key="index">
               <!-- <span v-html="note.text"></span> -->
               <core-highlight  :queries="note.highlights" :content="note.text" />
            </v-col>
         </v-row>
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
   mounted() {
      if(this.term.id === 300)
      {
        this.term.notes[0].text = this.term.notes[0].text.replace(/<br>/g, '');
      }
	},
}
</script>

<style>

</style>