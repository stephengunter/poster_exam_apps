<template>
	<v-container fluid grid-list-xl fill-height>
     <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<subject-selector ref="subject_selector" v-show="selector.subject.ready"
						:items="selector.subject.items" 
						:selected="params.subject"
						@selected="onSubjectSelected"
					>
						<v-tooltip top content-class="top">
							<v-btn @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
							<span>新增</span>
						</v-tooltip>
					</subject-selector>
					<term-selector ref="term_selector"  v-show="selector.term.ready"
						:show_last="true" :empty_text="'全部'"
						:items="selector.term.items"
						@selected="onTermSelected"
					/>
					
					<v-layout row wrap v-if="pageList">
						<v-flex sm12>
							<question-table :list="questions" @selected="edit"/>
						</v-flex>
						<v-flex sm12>
							<core-table-pager :model="pageList" :responsive="responsive" v-show="questions.length > 0" 
								@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
							/>
						</v-flex>	
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	   <v-dialog v-model="editing" persistent max-width="960px">
			<question-edit v-if="editing" :model="model"
				:terms="selector.term.items"
				:recruits="recruits"
				@submit="onSubmit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="deleting" width="480px">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { mapState } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_SUBJECTS, FETCH_RECRUITS, FETCH_TERMS, FETCH_QUESTIONS, CREATE_QUESTION, STORE_QUESTION,
EDIT_QUESTION, UPDATE_QUESTION, DELETE_QUESTION } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'QuestionsView',
	data () {
		return {
			params: {
				subject: 0,
				terms: '',
				keyword: '',
				page: 1,
				pageSize: 10
			},
			selector: {
				subject: {					
					items: [],
					ready: false
				},
				term: {
					items: [],
					ready: false
				}
			},

			editing: false,
			deleting: false,
			model: null,
			
		}
	},
	computed: {
		...mapState({
			responsive: state => state.app.responsive,
			subjects: state => state.subjects.list,
			terms: state => state.terms.list,
			recruits: state => state.recruits.list,
			pageList: state => state.questions.pageList,
		}),
		questions(){
			if(this.pageList){
				return this.pageList.viewList
			}else {
				return [];
			}
		},
		indexMode(){
			if(this.editing) return false;
			if(this.deleting) return false;
			return true;
		},
		canCreate(){
			return !this.editing && !this.deleting;
		},
		canEdit(){
			if(!this.selectedParentId) return false;
			return !this.editing && !this.deleting;
		},
		selectedSubjectId(){
			return this.subSubject.id;
		},
		selectedParentId(){
			return this.parentQuestion.id;
		}
	},
	beforeMount(){
		this.$store.dispatch(FETCH_RECRUITS);

		this.$store.dispatch(FETCH_SUBJECTS)
		.then(() => {
			this.selector.subject.items = this.subjects.slice(0);
			this.initSubjectSelector();
		})
		.catch(error => {
			onError(error);
		})
	},
	methods: {
		init(){
			this.editing = false;
			this.deleting = false;
			this.model = null;
		},
		initSubjectSelector(){
			window.setTimeout(() => {
				this.$refs.subject_selector.init();
			}, 500);
		},
		initTermSelector(){
			window.setTimeout(() => {
				this.$refs.term_selector.init();
			}, 500);
		},
		onSubjectSelected(id){
			this.params.subject = id;
			this.selector.subject.ready = true;

			this.fetchTerms(id);			
		},
		fetchTerms(subject){
			this.$store.dispatch(FETCH_TERMS, { subject })
			.then(() => {
				this.selector.term.items = this.terms.slice(0);
				this.initTermSelector();		
			})
			.catch(error => {
				onError(error);
			})
		},
		onTermSelected(ids){
			this.params.terms = ids.join();
			this.selector.term.ready = true;
			this.fetchData();			
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
					this.model = model;
					this.editing = true;
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
      cancelEdit(){
			this.model = null;  
         this.editing = false;
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