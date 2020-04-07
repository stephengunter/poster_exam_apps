<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row wrap>
                  <v-flex xs6>
							<v-select label="科目"
								:items="subjectOptions" v-model="params.subject"
								@change="onSubjectChanged"
							/>
						</v-flex>
						<v-flex xs6>
							<v-select label="年度" v-show="false"
								:items="recruitOptions" v-model="params.recruit"
								@change="onRecruitChanged"
							/>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs12>
							<analysis-summary ref="analysisSummary" :results="viewList"
							@selected="onSelected"
							/>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>

			<v-dialog v-model="selected.active" :max-width="selected.maxWidth">
				<analysis-details v-if="selected.model" :model="selected.model"
				:root_subject_settings="rootSubjectSettings"
				@cancel="onCancel" @save="saveExamSettings"
				/>
			</v-dialog>

      </v-layout>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { ANALYSIS_INDEX, RQ_ANALYSIS, SAVE_EXAM_SETTINGS } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
	name: 'QuestionAnalysisView',
	data () {
		return {
			params: {
				recruit: 0,
				subject: 0
			},

			rootSubjectSettings: null,
			version: 0,

			recruitOptions: [],
			subjectOptions: [],

			selected: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			viewList: state => state.analysis.viewList,
			results: state => state.analysis.results
		}),
		analysisSummary() {
			if(this.$refs.analysisSummary) return this.$refs.analysisSummary;
			else if (this.references.analysisSummary) return this.references.analysisSummary;
			return null;
		}
	},
	beforeMount(){
		this.init();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		init() {
			this.$store.dispatch(ANALYSIS_INDEX)
			.then(model => {
				this.rootSubjectSettings = model.rootSubjectSettings;
				this.loadRecruitOptions(model.recruits);
				this.loadSubjectOptions(model.subjects);

				this.$nextTick(() => {
               this.fetchData();
            });
			})
			.catch(error => {
				onError(error);
			})
		},
		fetchData() {
			this.$store.dispatch(RQ_ANALYSIS, this.params)
			.then(() => {
				this.$nextTick(() => {
					this.analysisSummary.init();
            });
			})
			.catch(error => {
				onError(error);
			})
		},
		loadRecruitOptions(recruits) {
			let options = recruits.map(item => ({ value: item.id, text: item.title }));
			if(this.params.recruit < 1) this.params.recruit = options[0].value;
			this.recruitOptions = options;
		},
		onRecruitChanged() {

		},
		loadSubjectOptions(subjects) {
			let options = subjects.map(item => ({ value: item.id, text: item.title }));
			if(this.params.subject < 1) this.params.subject = options[0].value;
			this.subjectOptions = options;
		},
		onSubjectChanged() {
			this.fetchData();
		},
		onSelected(recruitId) {
			this.selected.model = this.results.find(item => item.recruit.id === recruitId);
			if(this.contentMaxWidth) this.selected.maxWidth = this.contentMaxWidth;
			this.selected.active = true;
		},
		onCancel() {
			this.selected.active = false;
			this.selected.model = null;
		},
		saveExamSettings() {
			let model = this.selected.model;
			this.$store.dispatch(SAVE_EXAM_SETTINGS, model)
			.then(() => {
				Bus.$emit('success');
				this.onCancel();
			})
			.catch(error => {
				onError(error);
			})
		}
	}
}
</script>

<style>

</style>