<template>
   <core-container>
		<recruit-question-header ref="rqHeader" 
		:init_params="params" :can_create="canCreate"
		@params-changed="onParamsChanged" @create="create"
		/>
		<v-row v-if="dataList.length">
			<v-col cols="12">
				<question-table :list="dataList"
				:show_terms="true" :show_recruits="false"
				@edit="edit" @edit-resolves="editResolves"
				/>
			</v-col>
			
		</v-row>
		<v-row v-if="dataList.length">
			<v-col cols="10"  style="font-size:16px;padding-top: 20px;" >
				共 {{ pagedList.totalItems }} 題
			</v-col>
			<v-col cols="2" class="text-right">
				<core-button-create tooltip="新增" :disabled="!canCreate"
				@create="create"
				/>
			</v-col>
		</v-row>

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
import { SET_LOADING, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_QUESTIONS,
	FETCH_RECRUIT_QUESTIONS, CREATE_QUESTION, STORE_QUESTION,
	EDIT_QUESTION, UPDATE_QUESTION, DELETE_QUESTION,
	STORE_ATTACHMENT, STORE_OPTIONS, FETCH_RESOLVES 
} from '@/store/actions.type';

import { SET_NOTE_CATEGORIES } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, scrollToTop, deepClone } from '@/utils';

export default {
	name: 'RecruitQuestionsView',
	data () {
		return {
			params: {
				recruit: 0
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
			pagedList: state => state.questions.pagedList,
			recruits: state => state.questions.recruits
		}),
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
		},
		canCreate() {
			if(!this.params.recruit) return false;
			return !this.editor.active;
		},
		rqHeader() {
			if(this.$refs.rqHeader) return this.$refs.rqHeader;
			else if (this.references.rqHeader) return this.references.rqHeader;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };

		this.$store.dispatch(FETCH_QUESTIONS, { page: -1 })
      .then(() => {
         this.$nextTick(() => {
				this.rqHeader.init();
         });
      })
      .catch(error => {
         onError(error);
      })
   },
	methods: {
		onParamsChanged(params) {
			this.params.recruit = params.recruit;
			this.fetchData();
		},
		fetchData(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_RECRUIT_QUESTIONS, this.params)
			.catch(error => {
				onError(error);
			})
		},
		create() {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_QUESTION)
				.then(model => {
					let recruits = this.rqHeader.getSelectedRecruits().recruits;
					
					if(recruits && recruits.length) model.recruits = recruits.slice(0);
					if(this.editor.lastModel) {
						model.subjectId = this.editor.lastModel.subjectId;
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
					}else {
						let recruit = recruits[0];
						if(recruit.subjectId) model.subjectId = recruit.subjectId;
						else {
							let parent = this.recruits.find(x => x.id === recruit.parentId);
							model.subjectId = parent.subjectId;
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
			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(STORE_QUESTION, model)
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
			if(model) this.editor.lastModel = deepClone(model);

			Bus.$emit('success');
			this.fetchData();
			this.setEditModel(null);
		},
		getQuestion(id) {
			return this.pagedList.viewList.find(item => item.id === id);
		},
		editResolves(id){
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

<style>

</style>