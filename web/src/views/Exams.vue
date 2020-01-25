<template>
	<v-container>
		<exam-header ref="examHeader"
		:title="title"
		:fetch_params="fetchParams" :create_params="createParams" 
		:type_options="examTypeOptions"  :year_options="yearOptions"
		:recruit_type_options="recruitExamTypeOptions"
		:status_options="statusOptions" :subject_options="subjectOptions"
		@filter-submit="onFilterSubmit" @creator-submit="onCreatorSubmit"
		/>
		<div v-show="examIndexMode">
			<exam-table v-if="pagedList" :params="fetchParams" :model="pagedList" 
			@selected="onTableSelected"
			/>
		</div>

		<div v-show="examEditMode">
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
			@leave="setMode('index')" @aborted="setMode('index')"
         /> 
      </div>

		<v-dialog v-model="summary.active" :max-width="summary.maxWidth">
         <exam-summary :model="summary.model"
			@cancel="hideSummary"
			>
				<v-card-actions>
					<v-btn @click="removeExam" color="error">刪除</v-btn>
					<v-spacer />
					<v-btn @click="editExam" color="success">繼續作答</v-btn>
				</v-card-actions>
         </exam-summary>
      </v-dialog>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_ACTIONS, ACTION_SELECTED,
	NEW_EXAM, EDIT_EXAM, FETCH_EXAMS, FILTER_EXAMS,
	STORE_EXAM, SAVE_EXAM, ABORT_EXAM, CREATE_EXAM, 
	EXAM_RECORDS, EXAM_SUMMARY, DELETE_EXAM	
} from '@/store/actions.type';
import { SET_EXAM_PAGE_MODE, SET_APP_ACTIONS, SET_EXAM_TITLE } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { resolveErrorData, getRouteTitle, todayString } from '@/utils';
import Exam from '@/models/exam';


export default {
	name: 'ExamView',
	data() {
		return {
			title: '',
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

			summary: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			}
		}
	},
	computed: {
		...mapGetters(['exam', 'examIndexMode', 'examCreateMode', 'examEditMode', 
		'responsive','contentMaxWidth'
		]),
		...mapState({
			mode: state => state.exams.mode,
			pagedList: state => state.exams.pagedList,
			examActions: state => state.exams.actions,
		})
	},
	created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			this.title = getRouteTitle(this.$route);
			this.setMode('index');
		},
		setMode(name) {
			let mode = this.modeOptions.find(item => item.name === name);
			this.$store.commit(SET_EXAM_PAGE_MODE, mode);

			this.$nextTick(() => {
				if(this.examIndexMode) {
					this.fetchExams();
				}else if(this.examCreateMode) {
					
				}else if(this.examEditMode) {
					this.$refs.examEdit.init();
				}

				this.setActions();
            this.$refs.examHeader.init();
         })
		},
		setActions() {
			let blocks = [];
         let types = [];
         if(this.examIndexMode) {
				types = [FILTER_EXAMS, NEW_EXAM];
				blocks.push(types);
         }else if(this.examCreateMode) {
				types = [NEW_EXAM];
				blocks.push(types);
         }else if(this.examEditMode) {
				blocks.push([EXAM_RECORDS, EXAM_SUMMARY]);
				blocks.push(this.examActions.map(item => item.name));
			}

			this.$store.dispatch(LOAD_ACTIONS, blocks);
		},
		onActionSelected(name) {
			// console.log('onActionSelected', name);
			// console.log(this.$refs);
			if(this.examEditMode) {
				this.$refs.examEdit.handleAction(name);
				return;
			}

         if(name === FILTER_EXAMS) {
            this.$refs.examHeader.launchFilter();         
         }else if(name === NEW_EXAM) {
            this.$refs.examHeader.launchCreator();     
         }else {
				
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
			
         this.$store.dispatch(CREATE_EXAM, params)
         .then(exam => {
				let bread =  this.$refs.examHeader.getBread();
				let items = bread.items.slice(2);
				let title = `${items.join('_')}_${todayString().replace(/-/g,'')}`;
				
				this.$store.commit(SET_EXAM_TITLE, title);
				
				this.setMode('edit');
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		},
		editExam(model) {
			this.hideSummary();
			//繼續作答
			let id = model.id;
         this.$store.dispatch(EDIT_EXAM, id)
         .then(exam => {
				this.setMode('edit');
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		},
		removeExam() {
			this.hideSummary();
			showConfirm({
            type: 'error', 
            title: '確定要刪除此測驗嗎?',
            onOk: () => {
               this.abortExam();
            }
         });
		}
		
	}
}
</script>

<style scoped>
</style>
