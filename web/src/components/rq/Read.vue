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
   <v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
      <photo-show :model="showPhoto.model" @cancel="showPhoto.active = false" />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';

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
         showPhoto: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
         }
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
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
         this.showPhoto.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
      }
   }
}
</script>

<style>

</style>