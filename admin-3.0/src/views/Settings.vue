<template>
   <core-container>
      <v-row>
			<v-col cols="12" sm="6">
				<v-select label="科目"
				:items="subjectOptions" v-model="params.subject"
				@change="onSubjectChanged"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<analysis-details v-if="model" :show_title="false" :read_only="true"
				:model="model"
				/>
			</v-col>
		</v-row>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { FETCH_SUBJECTS, FIND_EXAM_SETTINGS } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
	name: 'SettingsView',
	data () {
		return {
			params: {
				subject: 0
			},
			
         subjectOptions: [],
         
         model: null
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth'])
	},
	beforeMount(){
		this.init();
	},
	methods: {
		init() {
			this.$store.dispatch(FETCH_SUBJECTS, { parent: 0, subItems: false })
			.then(subjects => {
            let subjectOptions = subjects.map(item => ({
               value: item.id, text: item.title
            }));

            this.params.subject = subjectOptions[0].value;
            this.subjectOptions = subjectOptions;

            this.fetchData();
			})
			.catch(error => {
				onError(error);
			})
		},
		fetchData() {
         this.model = null;
			this.$store.dispatch(FIND_EXAM_SETTINGS, this.params)
			.then(model => {
				this.model = model;
			})
			.catch(error => {
				onError(error);
			})
		},
		onSubjectChanged() {
			this.fetchData();
		}
	}
}
</script>