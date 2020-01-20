<template>
	<v-container>
		<ExamHeader ref="examHeader"
		:title="title" :mode="mode" :params="params"
		:status_options="statusOptions" :subject_options="subjectOptions"
		@filter-submit="onFilterSubmit"
		/>
		<ExamTable v-if="pagedList" :params="params" :model="pagedList" 
		@selected="onTableSelected"
		/>

		<v-dialog v-model="summary.active" :max-width="summary.maxWidth">
         <ExamSummary :model="summary.model"
			@cancel="hideSummary" @edit="editExam"
			@remove="removeExam"
			/>
      </v-dialog>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { NEW_EXAM, EDIT_EXAM, FETCH_EXAMS, 
	STORE_EXAM, SAVE_EXAM, ABORT_EXAM 
} from '@/store/actions.type';
import { SET_APP_ACTIONS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { fetchActions, resolveErrorData, getRouteTitle } from '@/utils';
import Exam from '@/models/exam';

import ExamHeader from '@/components/exam/Header';
import ExamTable from '@/components/exam/Table';
import ExamSummary from '@/components/exam/Summary';

export default {
	name: 'ExamView',
	components: {
		ExamHeader,
		ExamTable,
		ExamSummary
	},
	data() {
		return {
			title: '',
			mode: null,
			modeOptions: [{
				name: 'index',
				text: '紀錄'
			},{
				name: 'create',
				text: '新測驗'
			}],

			params: {
				subject: -1,
				status: -1,
				page: -1,
			},

			subjectOptions: [],
			statusOptions: [],
			actions: [],

			summary: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
         },
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
		...mapState({
         pagedList: state => state.exams.pagedList
		}),
      isIndexMode() {
         return this.mode && this.mode.name === 'index';
      },
      isCreateMode() {
         return this.mode && this.mode.name === 'create';
      }
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.title = getRouteTitle(this.$route);
			this.actions = fetchActions(this.$route.name);

			if(this.isAuthenticated) {
				this.setMode('index');
			}else {
				this.setMode('create');
			}
		},
		setMode(name) {
			this.mode = this.modeOptions.find(item => item.name === name);
			if(this.isIndexMode) {
            this.fetchExams();
         }else if(this.isCreateMode) {
            
         }
			
			this.setActions();
			this.$nextTick(() => {
            this.$refs.examHeader.init();
         })
		},
		setActions() {
         let types = [];
         let actions = [];
         if(this.isIndexMode) {
            types = [NEW_EXAM];
         }else if(this.isCreateMode) {
            types = [NEW_EXAM];
         }
         actions = this.actions.filter(item => types.includes(item.name));
         this.$store.commit(SET_APP_ACTIONS, actions);
         
		},
		onFilterSubmit() {
			this.fetchExams();
		},
		fetchExams() {
			let params = this.params;

         this.$store.dispatch(FETCH_EXAMS, params)
         .then(model => {
				if(this.params.page < 1) this.params.page = 1;

				if(model.subjectOptions.length) this.subjectOptions = model.subjectOptions;
				if(model.statusOptions.length) this.statusOptions = model.statusOptions;
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		},
		onTableSelected(item) {
			this.showSummary(item);
		},
		showSummary(item) {
         this.summary.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.summary.model = new Exam(item);
			this.summary.active = true;
		},
		hideSummary() {
			this.summary.model = null;
			this.summary.active = false;
		},
		editExam() {
			//繼續作答
			console.log('editExam');
		},
		removeExam() {
			console.log('removeExam');
		}
		
	}
}
</script>

<style scoped>
</style>
