<template>
	<core-category-selector ref="recruitSelector"
	:all_items="recruitList" :selected_id="params.recruit"
	@select-changed="onRecruitSelected" 
	>
		<v-flex text-xs-right>
			<v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
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
			recruitList: [],
			selectedRecruit: null
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
		onRecruitSelected(item) {
			this.selectedRecruit = item;
			this.params.recruit = item.id;
			this.$emit('params-changed');					
		},
		getSelectedRecruit() {
			return this.selectedRecruit;
		},
      create(){
         this.$emit('create');
      }
   }
}
</script>

<style>

</style>