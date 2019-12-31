<template>
	<core-category-selector ref="recruitSelector" :item_style="{ 'font-size': '14px' }"
	:all_items="recruitList" :selected_id="params.recruit"
	@select-changed="onRecruitSelected" 
	>
		<v-flex text-xs-right>
         <v-tooltip top content-class="top">
            <v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
               <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span>新增</span>
         </v-tooltip>
      </v-flex>
	</core-category-selector>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_RECRUITS } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
   name: 'RecruitQuestionsHeader',
   props: {
		can_create: {
			type: Boolean,
			default: false
		},
      params: {
			type: Object,
			default: null
		}
	},
   data () {
		return {
			recruitList:[]
		}
   },
   beforeMount(){
		this.$store.dispatch(FETCH_RECRUITS, { parent: -1 })
		.then(recruits => {
			this.recruitList = recruits;
			setTimeout(() => {
				this.$refs.recruitSelector.init();
			}, 500)
		})
		.catch(error => {
			onError(error);
		})
		 
   },
   methods: {
		onRecruitSelected(item){
			this.params.recruit = item.id;
			this.$emit('params-changed');
			// this.$store.commit(SET_LOADING, false);
			// let subjectId = 0;
			// if(item) subjectId = item.id;
			// if(!subjectId) return;

			// this.params.subject = subjectId;
			
			// this.subject.fullText = this.$refs.subjectSelector.getSelectedListText();
			// this.subject.selecting = false;
					
		},
      create(){
         this.$emit('create');
      }
   }
}
</script>

<style>

</style>