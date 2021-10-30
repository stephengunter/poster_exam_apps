<template>
<div v-if="model">
   <v-card>
      <v-card-text>
         <rq-part v-for="(part, index) in model.parts" :key="index" 
         :model="part" :start_index="getStartIndex(index)"
         @show-photo="onShowPhoto" 
         />
      </v-card-text>
   </v-card>
</div>   
</template>

<script>
import { SHOW_PHOTO } from '@/store/actions.type';

export default {
   name: 'RQRead',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   data() {
		return {
         
		}
   },
   computed: {
      questionCounts() {
         if(this.model) return this.model.parts.map(part => part.questions.length);
         return [];         
      }
   },
   methods: {
      getStartIndex(index) {
         if(index < 1) return 1;
         return this.questionCounts[index - 1] + 1;
      },
      onShowPhoto(photo) {
         Bus.$emit(SHOW_PHOTO, photo);
      }
   }
}
</script>

<style>

</style>