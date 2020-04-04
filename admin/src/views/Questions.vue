<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<question-header ref="questionHeader" 
					:multi_recruits="false"
					:params="params" :can_create="canCreate" 
					@params-changed="onParamsChanged" 
					@search="search" @clear-search="clearSearch"
					@create="create"
					/>
					<v-layout row wrap v-if="pageList">
						<v-flex sm12>
							<core-table-pager :model="pageList" :responsive="responsive" v-show="pageList.viewList.length > 0" 
								@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
							/>
						</v-flex>
						<v-flex sm12>
							<question-table :list="pageList.viewList"
							:show_terms="true"
							@edit="edit" @edit-resolves="editResolves"
							@show-photo="onShowPhoto" @show-term="onShowTerm" 
							/>
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
			:choice="editor.choice"
			@submit="onSubmit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="resolves.active" persistent :max-width="resolves.maxWidth">
			<resolve-edit v-if="resolves.active" :question="resolves.model"
			@saved="onResolvesSaved" @cancel="cancelEditResolves"
			/>
		</v-dialog>
		<v-dialog v-model="showTerm.active" :max-width="showTerm.maxWidth">
			<v-card v-if="showTerm.model">
				<v-card-text>
					<h3 v-if="showTerm.model.subject" style="margin-top: 5px;">{{ showTerm.model.subject.title }}  {{ showTerm.model.title }}</h3>
					<term-tree-item :item="showTerm.model" 
					:show_title="false" :max_width="showTerm.maxWidth" 
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
		<v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
			<v-card v-if="showPhoto.model">
				<v-card-text>
					<v-img class="img-center" :src="showPhoto.model.id | photoIdUrl"
					 :max-width="showPhoto.model.width"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
		<v-dialog v-model="deletion.active" :max-width="deletion.maxWidth">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING, CLEAR_ERROR, SET_ERROR, SET_NOTE_CATEGORIES } from '@/store/mutations.type';

import { FETCH_QUESTIONS, CREATE_QUESTION, STORE_QUESTION,
	EDIT_QUESTION, UPDATE_QUESTION, DELETE_QUESTION,
	STORE_ATTACHMENT, STORE_OPTIONS, FETCH_RESOLVES 
} from '@/store/actions.type';

import { DIALOG_MAX_WIDTH } from '@/config';
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
				model: null,
				choice: true,

				questionId: 0,
				lastModel: null
			},

			resolves: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,

				questionId: 0
			},

			showTerm: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			showPhoto: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			}
			
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
		this.$store.commit(SET_NOTE_CATEGORIES, []);
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
		onShowPhoto(photo) {
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
		},
		onShowTerm(item) {
			this.showTerm.model = item;
			this.showTerm.active = true;
		},
		search(keyword) {
			this.search;
		},
		clearSearch() {
			this.params.keyword = '';
		},
		fetchData(params){
			let model = {
				subject: params.subject,
				page: params.page,
				pageSize: params.pageSize,
			};
			if(params.term) model['term'] = params.term;
			if(params.recruits) model['recruit'] = Number(params.recruits);
			if(params.keyword) model['keyword'] = params.keyword;
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_QUESTIONS, model)
			.catch(error => {
				onError(error);
			})
		},
		getQuestion(id) {
			return this.pageList.viewList.find(item => item.id === id);
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_QUESTION, { subject: this.params.subject, term: this.params.term })
				.then(model => {
					
					let recruits = this.$refs.questionHeader.recruit.recruits;
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
				this.editor.questionId = 0;
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
			let model = this.editor.model;
			let hasMedia = (model.options.findIndex(item => item.medias.length > 0)) > -1;
			if(hasMedia) {
				let medias = [];
				for(let i = 0; i < model.options.length; i++) {
					let option = model.options[i];
					for(let j = 0; j < option.medias.length; j++) {
						medias.push({
							id: option.medias[j].id ? option.medias[j].id : 0,
							postType: 'Option',
							postId: option.id,
							files: [option.medias[j].file]
						})
					}
				}

				this.submit(model, medias);

			}else this.submit(model);
		},
		submit(model, medias = []) {
			if(model.id) this.update(model, medias);
			else this.store(model, medias);
		},
		uploadAttachments(medias) {
			let media  = medias.shift();
			let vm = this;
			vm.$store.dispatch(STORE_ATTACHMENT, media)
			.then(() => {
				if(medias.length) vm.uploadAttachments(medias);
				else vm.onSaved();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		store(model, medias) {
			let choice = this.editor.choice;
			let question = model;
			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(STORE_QUESTION, { choice, question })
			.then(question => {
				if(medias && medias.length) {
					question.options.forEach(option => {
						for(let i = 0; i < option.attachments.length; i++) {
							let attachment = option.attachments[i];
							let media = medias.find(item => item.files[0].name === attachment.name);
							if(media) {
								media.postId = attachment.postId;
								media.postType = attachment.postType;
							}
						}	
					});
					this.uploadAttachments(medias);
				}else this.onSaved(model);
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
      update(model, medias){
			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_QUESTION, model)
			.then(question => {
				if(medias && medias.length) {
					question.options.forEach(option => {
						for(let i = 0; i < option.attachments.length; i++) {
							let attachment = option.attachments[i];
							let media = medias.find(item => item.files[0].name === attachment.name);
							if(media) {
								media.postId = attachment.postId;
								media.postType = attachment.postType;
							}
						}	
					});
					this.uploadAttachments(medias);
				}else this.onSaved();
				
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		onSaved(model) {
			this.init();
			this.fetchData(this.params);
			Bus.$emit('success');

			if(model) this.editor.lastModel = model;
		},
		editResolves(id){
			
			let question = this.getQuestion(id);
			let model = { ...question };

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_RESOLVES, { question: question.id })
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

				if(this.contentMaxWidth) this.resolves.maxWidth = this.contentMaxWidth;
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