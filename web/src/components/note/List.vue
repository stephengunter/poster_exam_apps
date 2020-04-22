<template>
<div>
   <div class="mt-1">
      <v-row v-if="!term.hide" v-show="showTerm">
         <v-col cols="12">
            <term-read :term="term" />
         </v-col>
      </v-row>
      <v-card v-if="notes.length">
         <v-card-text>
            <note-item  v-for="(note, index) in notes" :key="index"
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
      mode: {
         type: Number,
         default: 0
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
   data() {
      return {
         notes: [],
         showTerm: false,
      }
   },
   beforeMount() {
		this.init();
	},
   // computed: {
   //    activeNotes() {
   //       if(this.term) {
   //          if(this.mode)  return this.term.notes.filter(item => item.active);
   //          else return this.term.notes.filter(item => item.active && item.important);
   //       }
   //       else return [];
   //    },
   //    showTerm() {
   //       return this.mode < 1;
   //    }
   // },
   methods: {
      init() {
         this.showTerm = this.mode < 1;

         if(this.mode) this.notes = this.term.notes.filter(item => item.active && item.important);
         else this.notes = this.term.notes.filter(item => item.active);
         
      },
      showPhoto(item) {
         this.$emit('show-photo', item);
      }
   }
}
</script>

<style>

</style>