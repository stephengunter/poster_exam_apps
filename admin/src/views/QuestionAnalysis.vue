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
							<analysis-rq :version="version" :results="results" />
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
      </v-layout>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ANALYSIS_INDEX, RQ_ANALYSIS } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
	name: 'QuestionAnalysisView',
	data () {
		return {
			params: {
				recruit: 0,
				subject: 0
			},
			version: 0,

			recruitOptions: [],
			subjectOptions: []
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			results: state => state.analysis.results
		})
	},
	beforeMount(){
		this.init();
	},
	methods: {
		init() {
			this.$store.dispatch(ANALYSIS_INDEX)
			.then(model => {
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
					this.version += 1;
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
		}
	}
}
</script>

<style>

</style>