<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<question-header ref="questionHeader" 
					:params="params" :can_create="canCreate" 
					@params-changed="onParamsChanged" @create="create"
					/>
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
	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<question-edit v-if="editor.active" :model="editor.model"
			@submit="onSubmit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="deletion.active" :max-width="deletion.maxWidth">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_QUESTIONS, CREATE_QUESTION, STORE_QUESTION,
EDIT_QUESTION, UPDATE_QUESTION, DELETE_QUESTION } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'QuestionsView',
	data () {
		return {
			params: {
				subject: 0,
				term: 0,
				recruits: '',
				keyword: '',
				page: 1,
				pageSize: 10
			},
			editor: {
				active: false,
				maxWidth: 800,
				model: null
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
			pageList: state => state.questions.pageList,
		}),
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		},
	},
	beforeMount(){
		this.init();
	},
	methods: {
		init(){
			this.editor.active = false;
			this.deletion.id = 0;
			this.deletion.active = false;
			this.setEditModel(null);
		},
		onPageChanged(page){
			this.params.page = page;
			this.onParamsChanged();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.onParamsChanged();
		},
		onParamsChanged() {
			this.fetchData(this.params);
		},
		fetchData(params){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_QUESTIONS, params)
			.catch(error => {
				onError(error);
			})
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_QUESTION, this.params)
				.then(model => {
					model.subjectId = this.params.subject;
					model.termId = this.params.term;
					if(this.params.recruits) {
						let recruitIds = this.$refs.questionHeader.getRecruitIds();
						model.recruits = recruitIds.map(id => {
							return { id };
						});
					}
					this.setEditModel(model);
				})
				.catch(error => {
					onError(error);
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
				this.editor.model = model;

				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.setEditModel(null);
		},
		remove(){
			if(this.contentMaxWidth) {
				if(this.responsive)  this.deletion.maxWidth = this.contentMaxWidth; 
				else this.deletion.maxWidth = this.contentMaxWidth * 0.6;
			}
			this.deletion.id = this.editor.model.id;
			this.deletion.active = true;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.deletion.id;
			this.$store.dispatch(DELETE_QUESTION, id)
				.then(() => {
					this.init();
					this.fetchData(this.params);
				})
				.catch(error => {
					Bus.$emit('errors');
				})
		},
		cancelDelete(){
			this.deletion.active = false;
			this.deletion.id = 0;
		},
		onSubmit(){
			this.submit(this.editor.model);
		},
      submit(model){
			this.$store.commit(CLEAR_ERROR);
			let action = model.id ? UPDATE_QUESTION : STORE_QUESTION;
         this.$store.dispatch(action, model)
			.then(() => {
				this.init();
				this.fetchData(this.params);
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