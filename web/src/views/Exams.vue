<template>
	<v-container>
		<exam-header ref="examHeader"
		:title="title" :mode="mode"
		:fetch_params="fetchParams" :create_params="createParams" 
		:exam="exam"
		:type_options="examTypeOptions"  :year_options="yearOptions"
		:recruit_type_options="recruitExamTypeOptions"
		:status_options="statusOptions" :subject_options="subjectOptions"
		@filter-submit="onFilterSubmit" @creator-submit="onCreatorSubmit"
		/>
		<div v-show="isIndexMode">
			<exam-table v-if="pagedList" :params="fetchParams" :model="pagedList" 
			@selected="onTableSelected"
			/>
		</div>

		<div v-show="isEditMode">
         <exam-edit ref="examEdit" :exam="exam"
         /> 
      </div>

		<v-dialog v-model="summary.active" :max-width="summary.maxWidth">
         <exam-summary :model="summary.model"
			@cancel="hideSummary" @edit="editExam"
			@remove="removeExam"
			/>
      </v-dialog>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { NEW_EXAM, EDIT_EXAM, FETCH_EXAMS, FILTER_EXAMS,
	STORE_EXAM, SAVE_EXAM, ABORT_EXAM, CREATE_EXAM
} from '@/store/actions.type';
import { SET_APP_ACTIONS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { fetchActions, resolveErrorData, getRouteTitle, todayString } from '@/utils';
import Exam from '@/models/exam';


export default {
	name: 'ExamView',
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
			},{
				name: 'edit',
				text: '模擬測驗'
			}],

			fetchParams: {
				subject: -1,
				status: -1,
				page: -1
			},

			createParams: {
				type: -1,
				rtype: -1,
				year: -1,
				subject: -1
			},
			
			examTypeOptions: [],
			recruitExamTypeOptions: [],
			yearOptions: [],
			subjectOptions: [],
			statusOptions: [],
			actions: [],

			summary: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},
			
			exam: null,
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
		},
		isEditMode() {
         return this.mode && this.mode.name === 'edit';
      }
	},
	created(){
		Bus.$on('action-selected', this.onActionSelected);
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
            types = [FILTER_EXAMS, NEW_EXAM];
         }else if(this.isCreateMode) {
            types = [NEW_EXAM];
         }
         actions = this.actions.filter(item => types.includes(item.name));
         this.$store.commit(SET_APP_ACTIONS, actions);
         
		},
		onActionSelected(name) {
         if(name === FILTER_EXAMS) {
            this.$refs.examHeader.launchFilter();           
         }else if(name === NEW_EXAM) {
            this.$refs.examHeader.launchCreator();           
         }
      },
		onFilterSubmit(params) {
			this.fetchParams = { ... params };
			this.fetchExams(params);
		},
		fetchExams(params) {
			if(!params) params = this.fetchParams;
         this.$store.dispatch(FETCH_EXAMS, params)
         .then(model => {
				if(this.fetchParams.page < 1) this.fetchParams.page = 1;

				if(model.examTypeOptions.length) this.examTypeOptions = model.examTypeOptions;
				if(model.recruitExamTypeOptions.length) this.recruitExamTypeOptions = model.recruitExamTypeOptions;
				if(model.yearOptions.length) this.yearOptions = model.yearOptions;
				if(model.subjectOptions.length) this.subjectOptions = model.subjectOptions;
				if(model.statusOptions.length) this.statusOptions = model.statusOptions;
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		},
		onCreatorSubmit(params) {
			this.createParams = { ... params };
			this.createExam(params);
		},
		onTableSelected(item) {
			console.log('onTableSelected', item);
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
		createExam(params) {
			this.setMode('create');
			this.exam = null;
         this.$store.dispatch(CREATE_EXAM, params)
         .then(exam => {
				this.exam = exam;
				this.setMode('edit');
				let bread =  this.$refs.examHeader.getBread();
				let items = bread.items.slice(2);
				let title = `${items.join('_')}_${todayString().replace(/-/g,'')}`;
            this.exam.title = title;
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
			
		},
		editExam(model) {
			//繼續作答
			this.hideSummary();

			let id = model.id;
			this.exam = null;
         this.$store.dispatch(EDIT_EXAM, id)
         .then(exam => {
				this.exam = exam;
				this.setMode('edit');
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		},
		removeExam() {
			console.log('removeExam');
		}
		
	}
}
</script>

<style scoped>
</style>
