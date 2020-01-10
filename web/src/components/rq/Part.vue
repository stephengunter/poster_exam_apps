<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <Item v-for="(question, index) in model.questions.viewList" :key="index"
      :order="index + start_index" :model="question"
      @show-photo="onShowPhoto" 
      />

      <v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
			<v-card v-if="showPhoto.model">
				<v-card-text>
               <span class="center-helper"></span>
					<v-img class="img-center" :src="showPhoto.model.id | photoIdUrl"
					 :max-width="showPhoto.model.width"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
   </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import Item from '@/components/question/Item';
export default {
   name: 'RQ_Part',
   components: {
      Item
   },
   props: {
		model: {
         type: Object,
         default: null
      },
      start_index: {
         type: Number,
         default: 0
      },
   },
   data () {
		return {
			showPhoto: {
				active: false,
				model: null,
				maxWidth: 480
			}
			
		}
	},
   computed: {
		...mapGetters(['responsive','contentMaxWidth'])
	},
   methods: {
      onShowPhoto(photo) {
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
		},
   }
}
</script>

<style>

</style>