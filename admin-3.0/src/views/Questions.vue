<template>
	<core-container>
		<question-header ref="questionHeader"
		:init_params="params" :can_create="canCreate"
		@params-changed="onParamsChanged" @create="create"
		/>
		
		<v-row v-if="pagedList">
			<v-col cols="12">
				<question-table :list="dataList"
				:show_terms="true"
				@edit="edit" @edit-resolves="editResolves"
				/>
			</v-col>
		</v-row>

		<core-table-pager v-if="pagedList" v-show="dataList.length > 0"
		:model="pagedList" :responsive="responsive"
		@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
		/>

		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<question-edit v-if="editor.active" :init_model="editor.model"
			@saved="onSaved" @cancel="cancelEdit"
			/>
		</v-dialog>
		
		<v-dialog v-model="resolves.active" persistent :max-width="resolves.maxWidth">
			<resolve-edit v-if="resolves.active" :question="resolves.model"
			@saved="onResolvesSaved" @cancel="cancelEditResolves"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR } from '@/store/mutations.type';
import { FETCH_QUESTIONS, CREATE_QUESTION, EDIT_QUESTION, FETCH_RESOLVES } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, scrollToTop, deepClone } from '@/utils';

export default {
	name: 'QuestionsView',
	data () {
		return {
			params: {
				subject: 0,
				term: 0,
				recruit: '',
				keyword: '',
				page: 1,
				pageSize: 10
			},

			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
				
				choice: true,
				lastModel: null
			},

			resolves: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,

				questionId: 0
			},
			
			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			subjects: state => state.questions.subjects,
			recruits: state => state.questions.recruits,
			pagedList: state => state.questions.pagedList,
		}),
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
		},
		canCreate(){
			return !this.editor.active;
		},
		questionHeader() {
			if(this.$refs.questionHeader) return this.$refs.questionHeader;
			else if (this.references.questionHeader) return this.references.questionHeader;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };

		this.$store.dispatch(FETCH_QUESTIONS, { page: -1 })
      .then(() => {
         this.$nextTick(() => {
				this.questionHeader.init();
         });
      })
      .catch(error => {
         onError(error);
      })
   },
	methods: {
		onParamsChanged(params) {
			this.params.subject = params.subject;
			this.params.term = params.term;
			this.params.recruit = params.recruit;
			this.params.keyword = params.keyword;

			this.params.page = 1;
			this.fetchData();
		},
		onPageChanged(page){
			this.params.page = page;
			this.fetchData();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.params.page = 1;
			this.fetchData();
		},
		fetchData() {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_QUESTIONS, this.params)
			.then(() => {
				scrollToTop();
			})
			.catch(error => {
				onError(error);
			})
		},
		create() {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_QUESTION, { subject: this.params.subject, term: this.params.term })
				.then(model => {
					let recruits = this.questionHeader.getSelectedRecruits().recruits;
					if(recruits && recruits.length) model.recruits = recruits.slice(0);

					if(this.editor.lastModel) {
						for(let i = 0; i < this.editor.lastModel.options.length; i++) {
							model.options.push({
								id: 0,
								questionId: 0,
								title: '',
								medias: [],
								attachments: [],
								correct: i === 0
							})
						}
					}

					this.setEditModel(model);
				})
				.catch(error => {
					onError(error);
				})
		},
		edit(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_QUESTION, id)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.setEditModel(null);
		},
		onSaved(model) {
			if(model) this.editor.lastModel = deepClone(model);

			Bus.$emit('success');
			this.fetchData();
			this.setEditModel(null);
		},
		getQuestion(id) {
			return this.pagedList.viewList.find(item => item.id === id);
		},
		editResolves(id) {
			let question = this.getQuestion(id);
			let model = { ...question };

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_RESOLVES, { question: id })
			.then(resolves => {
				model.resolves = resolves;
				this.setResolvesModel(model);
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		setResolvesModel(model) {
			if(model) {
				this.resolves.model = model;
				this.resolves.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.resolves.active = true;
			}else {
				this.resolves.model = null;
				this.resolves.active = false;
				this.resolves.questionId = 0;
			}
		},
      cancelEditResolves() {
			this.setResolvesModel(null);
		},
		onResolvesSaved() {
			this.onSaved();

			this.setResolvesModel(null);
		}
	}
}
</script>