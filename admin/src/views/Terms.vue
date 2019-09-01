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
						:items="selector.term.items" 
						:selected="params.parent"
						@selected="onParentSelected"
					/>
					
					<v-layout row wrap>
						<v-flex sm12>
							<term-table :list="list" @selected="edit"/>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
      </v-layout>
	   <v-dialog v-model="editting" persistent max-width="960px">
			<term-edit v-if="editting" :model="model"
			:subjects="selector.subject.items"
			:parents="selector.term.items"
			@submit="submit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="deleting" width="480px">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_SUBJECTS, FETCH_TERMS, CREATE_TERM, STORE_TERM,
EDIT_TERM, UPDATE_TERM, DELETE_TERM } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'TermsView',
	data () {
		return {
			params: {
				subject: 0,
				parent: 0
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
			list: [],

			editting: false,
			deleting: false,
			model: null,
			
		}
	},
	computed: {
		canCreate(){
			return !this.editting && !this.deleting;
		},
		canEdit(){
			if(!this.selectedParentId) return false;
			return !this.editting && !this.deleting;
		},
		selectedSubjectId(){
			return this.subSubject.id;
		},
		selectedParentId(){
			return this.parentTerm.id;
		}
	},
	beforeMount(){
		this.$store.dispatch(FETCH_SUBJECTS)
		.then(subjects => {
			this.init(subjects);
		})
		.catch(error => {
			onError(error);
		})
	},
	methods: {
		init(subjects){
			if(subjects){
				this.selector.subject.items = subjects;
				this.initSubjectSelector();
			}

			this.editting = false;
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
		clearCategories(){
			this.selector.term.items = [];
		},
		onSubjectSelected(id){
			this.clearCategories();

			this.params.subject = id;
			this.fetchData();
			this.selector.subject.ready = true;
		},
		onParentSelected(id){
			if(id !== this.params.parent){
				this.params.parent = id;
				this.fetchData();
			}
			
			this.selector.term.ready = true;
		},
		fetchData(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_TERMS, this.params)
				.then(terms => {	
					this.loadTerms(terms);		
				})
				.catch(error => {
					onError(error);
				})
		},
		loadTerms(terms){
			this.list = terms;
			if(!this.selector.term.items.length){
				this.selector.term.items = terms.slice(0);
				this.initTermSelector();
			}			
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_TERM, this.params)
				.then(model => {
					this.model = model;
					this.editting = true;
				})
				.catch(error => {
					Bus.$emit('errors');
				})
			
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_TERM, id)
				.then(model => {
					this.model = model;
					this.editting = true;
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
      cancelEdit(){
			this.model = null;  
         this.editting = false;
		},
		remove(){
			this.deleting = true;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_TERM, id)
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
      submit(){
			this.$store.commit(CLEAR_ERROR);
			let action = this.model.id ? UPDATE_TERM : STORE_TERM;
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