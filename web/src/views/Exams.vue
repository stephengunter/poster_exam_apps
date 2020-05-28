<template>
	<v-container>
		<exam-header ref="examHeader"
		:title="title" :init_params="params"
		@filter-submit="onFilterSubmit"
		/>
		
      <v-card v-show="list.length">
			<exam-list v-if="responsive" :list="list" :params="params"
			@selected="onSelected"
			/>
			<exam-table v-else :list="list" :params="params"
			@selected="onSelected"
			/>
   	</v-card>
		<scroll-loader :loader-method="loadMore" :loader-disable="!hasNextPage">
			<div v-show="loading" class="text-center">
				<v-progress-circular color="info" indeterminate size="36">
				</v-progress-circular>
			</div>
		</scroll-loader>

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
import { mapState, mapGetters } from 'vuex';
import { LOAD_ACTIONS, ACTION_SELECTED, SCROLL_TOP,
	NEW_EXAM, FETCH_EXAMS, FILTER_EXAMS, ABORT_EXAM,
	EXAM_RECORDS, EXAM_SUMMARY, DELETE_EXAM, UPDATE_EXAM	
} from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { tryParseInt, isTrue, isEmptyObject, onError, 
showConfirm, resolveErrorData, resolveQueryString
} from '@/utils';
import Exam from '@/models/exam';


export default {
	name: 'ExamView',
	data() {
		return {
			pageName: 'exams',
         title: '',
			
			params: {
				status: -1,
				subject: -1,
				sortBy: 'lastUpdated',
				desc: true
			},

			page: -1,
			pageSize: 10,

			scroller: {
				disable: true
			},

			loading: false,

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
			list: state => state.exams.list,
			pagedList: state => state.exams.pagedList,
			examActions: state => state.exams.actions,
		}),
		examHeader() {
			if(this.$refs.examHeader) return this.$refs.examHeader;
			else if (this.references.examHeader) return this.references.examHeader;
			return null;
		},
		hasNextPage() {
			if(this.pagedList) return this.pagedList.hasNextPage;
			return false;
		}
	},
	created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	beforeMount() {
		this.title = '測驗紀錄';
		this.pageName = this.$route.name;
		this.resolveQuery();
	},
	mounted() {
		this.references = { ...this.$refs };
		this.init();
	},
	watch:{
		$route (to, from){
			if(to.name === this.pageName && from.name === this.pageName) {
				this.resolveQuery();
				this.init();
			}
		}
	}, 
	methods: {
		resolveQuery() {
			let query = this.$route.query;
			if(query && !isEmptyObject(query)) {
				let keys = [];
				let numFields = ['status', 'subject'];
				for (let field in this.params) {
					if(query.hasOwnProperty(field)) {
						if(numFields.includes(field)) this.params[field] = tryParseInt(query[field]);
						else if(field === 'desc') this.params[field] = isTrue(query[field]);
						else this.params[field] = query[field];
					} 
				}
			}
		},
		init() {
			this.examHeader.init();

			if(this.indexModel) this.page = 1;
			
			this.fetchData();
			this.setActions();
			
		},
		setActions() {
			let blocks = [];
         let types = [];
         types = [FILTER_EXAMS, NEW_EXAM];
			blocks.push(types);
			this.$store.dispatch(LOAD_ACTIONS, blocks);
		},
		onActionSelected(name) {
			if(this.$route.name !== this.pageName) return;
			
         if(name === FILTER_EXAMS) {
            this.examHeader.launchFilter();         
         }else if(name === NEW_EXAM) {
            this.$router.push({ path: '/exams/new' });
         }
      },
		onFilterSubmit(params) {
			this.params = { ...params };
			this.onParamsChanged();
		},
		onParamsChanged() {
			this.$store.commit(SET_LOADING, true);
			this.$router.push({ name: 'exams', query: this.params });
		},
		fetchData(params) {
			this.hideSummary();

			this.loading = true;
			if(!params) params = this.params;
			let page = this.page;
			let pageSize = this.pageSize;

         this.$store.dispatch(FETCH_EXAMS, {...params, page, pageSize })
         .then(model => {
				if(this.page < 0) this.page = 1;
				if(this.page === 1) this.$store.dispatch(SCROLL_TOP);
				this.$nextTick(() => {
					this.examHeader.setTitle();
				});
         })
			.catch(error => {
            onError(error);
			})
			.finally(() => { 
				this.loading = false;
			});
		},
		loadMore() {
			this.loading = true;
			this.page += 1;
			this.fetchData();
		},
		onSelected(item) {
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
		refresh() {
			this.page = 1;
			this.fetchData();
		},
		updateExamTitle() {
			let model = this.save.model;
			this.$store.dispatch(UPDATE_EXAM, model)
         .then(() => {
				this.onSaveCanceled();
				this.refresh();
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
				this.refresh();
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