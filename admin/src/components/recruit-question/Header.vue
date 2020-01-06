<template>
	<recruit-selector ref="recruitSelector"
	:selected_ids="recruit.ids" :multi="false"
	:recruits="recruitList"
	@submit="onRecruitSelected"
	>
		<v-flex xs12 sm6 md6 text-xs-right>
			<v-btn :disabled="!can_create" click.prevent="create" class="mx-2" fab small color="info">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</v-flex>
	</recruit-selector>
	<!-- <core-category-selector ref="recruitSelector"
	:all_items="recruitList" :selected_id="params.recruit"
	@select-changed="onRecruitSelected" 
	>
		<v-flex text-xs-right>
			<v-btn :disabled="!can_create" @click.prevent="create" class="mx-2" fab small color="info">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
      </v-flex>
	</core-category-selector> -->
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
			recruit: {
				ids: [],
				changes: 0
			}
		}
   },
   beforeMount(){
		this.$store.dispatch(FETCH_RECRUITS)
		.then(recruits => {
			this.recruitList = recruits;
		})
		.catch(error => {
			onError(error);
		})

		this.init();
		 
   },
   methods: {
		init() {
			let selectedIds = [];
			if(this.params.recruits) {
				selectedIds = this.params.recruits.split(',').map(id => parseInt(id));
			}
			this.recruit.ids = selectedIds;
		},
		onRecruitSelected({ recruits, ids, idsText }) {
			this.recruit.ids = ids;
			this.recruit.changes += 1;

			this.setParams('recruits', idsText);
		},
      create(){
         this.$emit('create');
      }
   }
}
</script>

<style>

</style>