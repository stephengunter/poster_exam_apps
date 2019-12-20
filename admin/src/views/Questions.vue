<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row v-show="!subject.selecting">
						<v-flex xs12 sm6 md6>
							<a href="#" @click.prevent="selectSubject"> {{ subject.title }}： {{ subject.fullText }} </a>
						</v-flex>
						<v-flex xs12 sm6 md6 text-xs-right>
							<v-tooltip top content-class="top">
								<v-btn :disabled="!canCreate" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
									<v-icon>mdi-plus</v-icon>
								</v-btn>
								<span>新增</span>
							</v-tooltip>
						</v-flex>
					</v-layout>
					<v-layout row v-show="!term.selecting">
						<v-flex xs12>
							<a href="#" class="text-truncate" @click.prevent="selectTerm"> {{ term.title }}： {{ term.fullText }} </a>
						</v-flex>
					</v-layout>
					
					<v-layout row wrap v-if="pageList">
						<v-flex sm12>
							<question-table :list="pageList.viewList" @edit="edit"/>
						</v-flex>
						<v-flex sm12>
							<core-table-pager :model="pageList" :responsive="responsive" v-show="pageList.viewList.length > 0" 
								@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
							/>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	  <v-dialog v-model="subject.selecting" :max-width="subject.maxWidth">
			<v-card>
				<v-card-text>
					<v-container>
						<core-category-selector ref="subjectSelector" :title="subject.title"
						:all_items="subjectList" :selected_id="params.subject"
						@select-changed="onSubjectSelected"
						/>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-dialog v-model="term.selecting" :max-width="term.maxWidth">
			<v-card>
				<v-card-title>
					<span class="headline">{{ '選擇' + term.title }}</span>
					<v-spacer />
					<a href="#" @click.prevent="term.selecting = false">
						<v-icon>mdi-window-close</v-icon>
					</a>
				</v-card-title>
				<v-card-text>
					<v-container>
						<core-category-selector ref="termSelector" :title="term.title"
						:all_items="termList" :selected_id="params.term"
						@select-changed="onTermSelected"
						/>
						<v-layout v-if="term.model" row wrap>
							<v-flex sm12>
								<div v-html="term.model.fullText">

								</div>
								
							</v-flex>
						</v-layout>
					</v-container>
					
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn @click.prevent="onSubmitTerm" color="primary">確定</v-btn>
					
				</v-card-actions>
			</v-card>
		</v-dialog>
	   <!-- <v-dialog v-model="editing" persistent max-width="960px">
			<question-edit v-if="editing" :model="model"
				:terms="selector.term.items"
				:recruits="recruits"
				@submit="onSubmit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="deleting" width="480px">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog> -->
	</v-container>
    
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_SUBJECTS, FETCH_RECRUITS, FETCH_TERMS, FETCH_QUESTIONS, CREATE_QUESTION, STORE_QUESTION,
EDIT_QUESTION, UPDATE_QUESTION, DELETE_QUESTION } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'QuestionsView',
	data () {
		return {
			params: {
				subject: 0,
				term: 0,
				keyword: '',
				page: 1,
				pageSize: 10
			},

			subject: {
				title: '科目',
				selecting: false,
				maxWidth: 800,
				fullText: ''
			},
			term: {
				title: '條文',
				id: 0,
				selecting: false,
				maxWidth: 800,
				fullText: '',
				model: null
			},

			editor: {
				active: false,
				maxWidth: 800,
				model: null,
				subjects: [],
				allItems: []
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: 480
			},
			
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			subjectList: state => state.subjects.list,
			termList: state => state.terms.list,
			// recruits: state => state.recruits.list,
			pageList: state => state.questions.pageList,
		}),
		// questions(){
		// 	if(this.pageList){
		// 		return this.pageList.viewList
		// 	}else {
		// 		return [];
		// 	}
		// },
		// indexMode(){
		// 	if(this.editing) return false;
		// 	if(this.deleting) return false;
		// 	return true;
		// },
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		}
	},
	beforeMount(){
		this.$store.dispatch(FETCH_SUBJECTS, { subItems: false })
		.then(subjects => {
			//this.$store.commit(SET_LOADING, true);
			setTimeout(() => {
				this.$refs.subjectSelector.init();
			}, 500)
		})
		.catch(error => {
			onError(error);
		})
		// this.$store.dispatch(FETCH_RECRUITS);

		// this.$store.dispatch(FETCH_SUBJECTS)
		// .then(() => {
		// 	this.selector.subject.items = this.subjects.slice(0);
		// 	this.initSubjectSelector();
		// })
		// .catch(error => {
		// 	onError(error);
		// })
	},
	methods: {
		init(){
			

			
		},
		selectSubject() {
			if(this.contentMaxWidth) this.subject.maxWidth = this.contentMaxWidth;
			this.subject.selecting = true;
		},
		onSubjectSelected(item){
			let subjectId = 0;
			if(item) subjectId = item.id;
			if(!subjectId) return;

			//this.$store.commit(SET_LOADING, true);

			this.fetchTerms(subjectId);

			this.params.subject = subjectId;
			
			this.subject.fullText = this.$refs.subjectSelector.getSelectedListText();
			this.subject.selecting = false;
					
		},
		fetchTerms(subject){
			let parent = -1;
			let subItems = false;
			
			this.$store.dispatch(FETCH_TERMS, { subject, parent, subItems })
			.then(terms => {
				//this.$store.commit(SET_LOADING, true);
				setTimeout(() => {
					this.$refs.termSelector.init();
				}, 500);
				
			})
			.catch(error => {
				onError(error);
			})
		},
		selectTerm() {
			if(this.contentMaxWidth) this.term.maxWidth = this.contentMaxWidth;
			this.term.selecting = true;
		},
		onTermSelected(item){
			this.setSelectedTerm(item);

			if(this.term.selecting) {
				
			}else {
				this.onSubmitTerm();
			}
		},
		setSelectedTerm(item) {
			if(item) this.term.model = item;
			else this.term.model = null;
		},
		onSubmitTerm() {
			if(this.term.model) this.params.term = this.term.model.id;
			else this.params.term = 0;

			this.fetchData();
			this.term.selecting = false;
			this.term.fullText = this.$refs.termSelector.getSelectedListText();
		},
		onPageChanged(page){
			this.params.page = page;
			this.fetchData();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.fetchData();
		},
		fetchData(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_QUESTIONS, this.params)
			.catch(error => {
				onError(error);
			})
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_QUESTION, this.params)
				.then(model => {
					this.model = model;
					this.editing = true;
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_QUESTION, id)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.subjects = this.subjectList;

				this.editor.model = model.term;
				this.editor.allItems = model.parents;

				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.allItems = [];
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.setEditModel(null);
		},
		remove(){
			this.deleting = true;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_QUESTION, id)
				.then(() => {
					this.init();
					this.fetchData();
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
		cancelDelete(){
			this.deleting = false;
		},
		onSubmit(){
			let correctIndex = this.model.options.findIndex(item => item.correct);
			if(correctIndex < 0){
				let error = { options: ['必須要有一個正確選項'] };
				this.$store.commit(SET_ERROR, error);
			}else this.submit();
		},
      submit(){
			this.$store.commit(CLEAR_ERROR);
			let action = this.model.id ? UPDATE_QUESTION : STORE_QUESTION;
         this.$store.dispatch(action, this.model)
				.then(() => {
					this.init();
					this.fetchData();
					Bus.$emit('success');
				})
				.catch(error => {
					if(!error)  Bus.$emit('errors');
					else this.$store.commit(SET_ERROR, error);
				})
		}
	}
}
</script>