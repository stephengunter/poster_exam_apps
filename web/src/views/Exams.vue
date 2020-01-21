<template>
	<v-container>
		<exam-header ref="examHeader"
		:title="title" :mode="mode"
		:init_params="params"
		:status_options="statusOptions" :subject_options="subjectOptions"
		@filter-submit="onFilterSubmit"
		/>
		<exam-table v-if="pagedList" :params="params" :model="pagedList" 
		@selected="onTableSelected"
		/>

		<v-dialog v-model="summary.active" :max-width="summary.maxWidth">
         <exam-summary :model="summary.model"
			@cancel="hideSummary" @edit="editExam"
			@remove="removeExam"
			/>
      </v-dialog>

		<div v-if="false" v-show="isEditMode">
         <exam-edit ref="examEdit" :exam="exam"
         /> 
      </div>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { NEW_EXAM, EDIT_EXAM, FETCH_EXAMS, FILTER_EXAMS,
	STORE_EXAM, SAVE_EXAM, ABORT_EXAM
} from '@/store/actions.type';
import { SET_APP_ACTIONS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { fetchActions, resolveErrorData, getRouteTitle } from '@/utils';
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
         }
      },
		onFilterSubmit(params) {
			this.params = { ... params };
			this.fetchExams(params);
		},
		fetchExams(params) {
			if(!params) params = this.params;
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
		editExam(model) {
			//繼續作答
			let id = model.id;
			this.exam = null;
         this.$store.dispatch(EDIT_EXAM, id)
         .then(exam => {
				this.exam = exam;
				console.log('this.exam',this.exam);
            //this.setActions();
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
