<template>
	<v-container>
		<exam-header ref="examHeader"
		:title="title" :fetch_params="fetchParams"
		@filter-submit="onFilterSubmit"
		/>
		<exam-table ref="examTable" :init_params="fetchParams" :model="pagedList" 
		@options-changed="onTableOptionChanged" @selected="onTableSelected"
		/>

		<v-dialog v-model="summary.active" :max-width="summary.maxWidth">
         <exam-summary v-if="summary.active" :model="summary.model" 
			@edit="editExamTitle(summary.model)" @cancel="hideSummary"
			>
				<v-card-actions>
					<v-btn @click="onRemoveExam(summary.model)" color="error">刪除</v-btn>
					<v-spacer />
					<v-btn v-if="summary.model.isComplete" @click="readExam(summary.model.id)" color="primary">閱讀解析</v-btn>
					<v-btn v-else @click="editExam(summary.model.id)" color="success">繼續作答</v-btn>
				</v-card-actions>
         </exam-summary>
      </v-dialog>

		<v-dialog v-model="save.active" :max-width="save.maxWidth" persistent>
			<exam-save v-if="save.active" :model="save.model" 
			@save="updateExamTitle" @cancel="onSaveCanceled"
			/>
		</v-dialog>
	</v-container>
</template>

<script>
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import { mapState, mapGetters } from 'vuex';
import { LOAD_ACTIONS, ACTION_SELECTED,
	NEW_EXAM, FETCH_EXAMS, FILTER_EXAMS, ABORT_EXAM,
	EXAM_RECORDS, EXAM_SUMMARY, DELETE_EXAM, UPDATE_EXAM	
} from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { showConfirm, resolveErrorData, getRouteTitle } from '@/utils';
import Exam from '@/models/exam';


export default {
	name: 'ExamView',
	data() {
		return {
			title: '',
			// params: {
			// 	rootRecruitId: 0
			// },

			fetchParams: {
				status: -1,
				subject: -1,
				sortBy: 'lastUpdated',
				desc: true,
				page: -1,
				pageSize: 10
			},

			summary: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			save: {
            model: null,
            maxWidth: DIALOG_MAX_WIDTH,
            active: false,
            callback: null,
            on_ok: null
         },
			
			references: {}
		}
	},
	computed: {
		...mapGetters(['exam', 'responsive','contentMaxWidth'
		]),
		...mapState({
			indexModel: state => state.exams.indexModel,
			pagedList: state => state.exams.pagedList,
			examActions: state => state.exams.actions,
		}),
		examHeader() {
			if(this.$refs.examHeader) return this.$refs.examHeader;
			else if (this.references.examHeader) return this.references.examHeader;
			return null;
		},
		examTable() {
			if(this.$refs.examTable) return this.$refs.examTable;
			else if (this.references.examTable) return this.references.examTable;
			return null;
		}
	},
	created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	mounted() {
		this.references = { ...this.$refs };
		this.init();
	},
	methods: {
		init() {
			this.title = getRouteTitle(this.$route);
			this.fetchExams();
			this.setActions();
			this.$nextTick(() => {
				this.examHeader.init();
			});
			
		},
		setActions() {
			let blocks = [];
         let types = [];
         types = [FILTER_EXAMS, NEW_EXAM];
			blocks.push(types);
			this.$store.dispatch(LOAD_ACTIONS, blocks);
		},
		onActionSelected(name) {
         if(name === FILTER_EXAMS) {
            this.examHeader.launchFilter();         
         }else if(name === NEW_EXAM) {
            this.$router.push({ path: '/exams/new' });
         }
      },
		onFilterSubmit(params) {
			this.fetchParams = { ... params };
			this.fetchExams(params);
		},
		onTableOptionChanged(options) {
			if(this.fetchParams.page < 0) return;
			let origin = pick(this.fetchParams, 'page', 'pageSize', 'sortBy', 'desc');
		
			//判斷是否參數有變
			
			if(isEqual(origin, options)) return;

			this.fetchParams.page = options.page;
			this.fetchParams.pageSize = options.pageSize;
			this.fetchParams.sortBy = options.sortBy;
			this.fetchParams.desc = options.desc;
			
			this.$nextTick(() => {
				this.fetchExams(this.fetchParams);
         });

		},
		fetchExams(params) {
			this.hideSummary();

			if(!params) params = this.fetchParams;
         this.$store.dispatch(FETCH_EXAMS, params)
         .then(model => {
				if(this.fetchParams.page < 0) this.fetchParams.page = 1;
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
			this.summary.active = false;
			this.summary.model = null;
		},
		editExamTitle(model) {
			this.hideSummary();
			this.save = {
				model: { ... model },
				maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH,
				active: true,
				on_ok: null,
				callback: null
			};	
					
		},
		updateExamTitle() {
			let model = this.save.model;
			this.$store.dispatch(UPDATE_EXAM, model)
         .then(() => {
				this.onSaveCanceled();
				this.fetchExams();
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		},
		onSaveCanceled() {
         this.save = {
            model: null,
            maxWidth: DIALOG_MAX_WIDTH,
            active: false,
            on_ok: null,
            callback: null
         };
      },
		editExam(id) {
			this.$router.push({ path: `/exams/edit/${id}` });
			this.hideSummary();
		},
		readExam(id) {
			this.$router.push({ path: `/exams/${id}` });
			this.hideSummary();
		},
		onRemoveExam(model) {
			showConfirm({
            type: 'error', 
            title: '確定要刪除此測驗嗎?',
            onOk: () => {
               this.removeExam(model);
            }
			});
		},
		removeExam(model) {
			let id = model.id;
         this.$store.dispatch(ABORT_EXAM, id)
         .then(() => {
				this.fetchExams();
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
		}
		
	}
}
</script>

<style scoped>
</style>