<template>
	<div>
		<v-row>
			<v-col cols="12" sm="8">
				<recruit-selector ref="recruitSelector" title="考古題"
				:recruit_list="recruits" :multi="false" :allow_empty="false" 
				@selected="onRecruitSelected"
				/>
			</v-col>
			<v-col cols="12" sm="4">
				<v-row>
					<v-col style="font-size:16px;padding-top: 20px;">
						<span v-if="pagedList">共 {{ pagedList.totalItems }} 題</span>
					</v-col>
					<v-col class="text-right">
						<core-button-create class_name="mb-2" tooltip="新增" :disabled="!can_create"
						@create="create"
						/>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</div>
	
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
      init_params: {
			type: Object,
			default: null
		}
	},
   data () {
		return {
			params: null,
			references: {}
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth', 'responsive']),
		...mapState({
			pagedList: state => state.questions.pagedList,
			recruits: state => state.questions.recruits
		}),
		recruitSelector() {
			if(this.$refs.recruitSelector) return this.$refs.recruitSelector;
			else if (this.references.recruitSelector) return this.references.recruitSelector;
			return null;
		}
	},
   beforeMount() {
		this.params = {
			recruit: this.init_params ? this.init_params.recruit : 0
		};
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		init() {
			this.initRecruitSelector();
		},
		initRecruitSelector() {
			this.recruitSelector.init([this.params.recruit]);
			if(!this.params.recruit) {
				let recruit = this.recruitSelector.category.models[0].items[0];
				if(recruit.subItems && recruit.subItems.length) {
					this.onRecruitSelected(recruit.subItems[0].id);
				}else {
					this.onRecruitSelected(recruit.id);
				}
			}
		},
		onRecruitSelected(id) {
			if(id === this.params.recruit) return;
			
			this.params.recruit = id;
			this.onParamsChanged();

				
			this.recruitSelector.setRecruit(id);
			this.recruitSelector.cancelSelect();				
		},
		getSelectedRecruits() {
			return this.recruitSelector.selected;
		},
		onParamsChanged() {
			this.$emit('params-changed', this.params);
		},
      create(){
         this.$emit('create');
      }
   }
}
</script>