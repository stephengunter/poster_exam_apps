<template>
<div>
	<form @submit.prevent="onSubmit">
		<v-card>
			<v-card-title>
				<h3>{{ title }}</h3>
				<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
				<v-spacer />
				<v-btn @click.prevent="cancel" icon>
					<v-icon>mdi-window-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<validation-observer ref="validator">
					<v-container>
						<question-header ref="questionHeader"
						:init_params="header.params" :mode="header.mode"
						/>
						<v-row>
							<v-col cols="12">
								<validation-provider v-slot="{ errors }" name="標題" rules="required">
									<v-textarea label="標題" v-model="model.title"
									:error-messages="errors"
									rows="5" row-height="15" outlined auto-grow
									/>
								</validation-provider>
							</v-col>
							<v-col v-if="model.attachments.length && model.attachments[0].id" cols="12">
								<v-img :src="model.attachments[0].previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1">
									<core-close-icon-button color="success"
									@close="removeAttachments"
									/>
								</v-img>
							</v-col>
							<v-col v-else cols="12">
								<v-img v-if="model.medias[0]" :src="model.medias[0].thumb.data" max-width="100" aspect-ratio="1">
									<core-close-icon-button color="success"
									@close="removeMedia"
									/>
								</v-img>
								<core-upload-button v-if="model.medias.length === 0" color="default" :multiple="false"
								@file-added="onFileAdded"
								>
                           附圖<v-icon right dark>mdi-image</v-icon>
                        </core-upload-button>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-checkbox v-model="model.multiAnswers" label="複選" 
								/>
							</v-col>
							<v-col cols="6">
								<v-checkbox v-if="isCreate" v-model="choice" label="加入精選" 
								/>
							</v-col>
						</v-row>
						<option-edit ref="optionEditor" :init_models="model.options"
						:question_id="model.id" :multi_answers="model.multiAnswers"
						@submit="onOptionSubmit"
						/>
						<core-error-list />
						<v-row>
							<v-col cols="6" class="text-left">
								<v-btn v-if="canRemove" @click.prevent="onRemove" color="error">刪除</v-btn>
							</v-col>
							<v-col cols="6" class="text-right">
								<v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
							</v-col>
						</v-row>
					</v-container>
				</validation-observer>
			</v-card-text>
		</v-card>
	</form>
</div>	
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { CREATE, EDIT } from '@/consts';
import Category  from '@/models/category';
import { STORE_QUESTION, UPDATE_QUESTION, DELETE_QUESTION,
	STORE_ATTACHMENT, STORE_OPTIONS
} from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, isYearRecruit } from '@/utils';

export default {
	name: 'QuestionEdit',
	props: {
		init_model: {
         type: Object,
         default: null
		},
		choice: {
         type: Boolean,
         default: true
		},
	},
	data () {
		return {
			model: null,
			header: {
				mode: EDIT, 
				params: null
			},
			media: {
            fileNames: []
         },
			references: {}
		}
	},
	beforeMount() {
		if(this.init_model) {
         let model = { ...this.init_model, medias: [] };
			let params = {
				subject: model.subjectId,
				terms: model.termIds ? model.termIds.split(',').map(x => parseInt(x)) : [],
				recruits: []
			};
			
			if(model.recruits.length) {
				params.recruits = model.recruits.map(item => item.id);
			}
			this.model = model;
			this.header.params = params;
      }
		
	},
	computed: {
		...mapGetters(['contentMaxWidth', 'responsive']),
		...mapState({
			subjects: state => state.questions.subjects,
			terms: state => state.terms.list,
			recruits: state => state.questions.recruits
		}),
		mode() {
			if(this.model && this.model.id) return EDIT;
			return CREATE;
		},
		isCreate() {
			return this.mode === CREATE;
		},
		title() {
			let text = '問題';

			if(this.mode === EDIT) return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove() {
			return this.mode === EDIT;
		},
		questionHeader() {
			if(this.$refs.questionHeader) return this.$refs.questionHeader;
			else if (this.references.questionHeader) return this.references.questionHeader;
			return null;
		},
		optionEditor() {
			if(this.$refs.optionEditor) return this.$refs.optionEditor;
			else if (this.references.optionEditor) return this.references.optionEditor;
			return null;
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	mounted() {
		this.references = { ...this.$refs };

		this.questionHeader.init();
	},
	methods: {
		cancel(){
			this.$emit('cancel');
		},
		fileExist(filename) {
			if(this.model.medias && this.model.medias.length) {
				return this.model.medias[0].file.name === filename;
			}
			return false;
      },
		onFileAdded({ files, thumbs }) {
         let file = files[0];
         if(this.fileExist(file.name)) {
            Bus.$emit('warning', '圖片重複');
         }else {
            let thumb = thumbs[0];
            this.model.medias = [{ file, thumb }];
         }
      },
		onSubmit() {
			let params = this.questionHeader.params;
			this.model.subjectId = params.subject;
			this.model.termIds = params.terms.join();

			let recruits = this.questionHeader.getSelectedRecruits().recruits;
			if(recruits && recruits.length) this.model.recruits = recruits.slice(0);
			else this.model.recruits = [];
			
			this.$store.commit(CLEAR_ERROR);
			this.validator.validate().then(valid => {
				if(!valid) return;

				this.optionEditor.submit();
			});      
		},
		checkOptions(options) {
			if(!options.length) return '必須要有選項';
			let msg = '';
			let correctCount = 0;
			for(let i = 0; i < options.length; i++) {
            if(options[i].correct) correctCount += 1;
			}
			if(correctCount === 0) return '必須要有正確的選項';

			if(this.model.multiAnswers) {
				
			}else {
				if(correctCount > 1) msg = '單選題只能有一個正確選項';
			}

			return msg;
		},
		onOptionSubmit(options) {
			let msg = this.checkOptions(options);
			if(msg) {
				this.$store.commit(SET_ERROR, { 'options' : [msg] });
				return;
			}
			if(this.model.medias.length) {
				this.model.attachments = this.model.medias.map(item => ({ name: item.file.name }));
			}
			
			
			this.model.options = options.slice(0);
			this.model.options.forEach(option => {
				if(option.medias.length) {
					option.attachments = option.medias.map(item => ({ name: item.file.name }));
				}
			});
			
			let medias = this.model.medias.map(item => {
				let id = item.id ? item.id : 0;
				let postType = 'Question';
				let postId = this.model.id;
				let files = [this.model.medias[0].file];
				return { id, postType, postId, files };
			});
			let optionMedias = this.loadOptionMedias();
			this.submit(medias, optionMedias);
		},
		loadOptionMedias() {
			let medias = [];
			let hasMedia = (this.model.options.findIndex(item => item.medias.length > 0)) > -1;
			if(hasMedia) {
				for(let i = 0; i < this.model.options.length; i++) {
					let option = this.model.options[i];
					for(let j = 0; j < option.medias.length; j++) {
						medias.push({
							id: option.medias[j].id ? option.medias[j].id : 0,
							postType: 'Option',
							postId: option.id,
							files: [option.medias[j].file]
						})
					}
				}	
			}
			return medias;
		},
		submit(medias, optionMedias) {
			if(this.model.id) this.update(medias, optionMedias);
			else this.store(medias, optionMedias);
		},
		store(medias, optionMedias) {
			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(STORE_QUESTION, { choice: this.choice, question: this.model })
			.then(question => {
				if(medias.length || optionMedias.length) {
					this.saveAttachments(question, medias, optionMedias);
				}else this.onSaved();
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		update(medias, optionMedias) {
			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_QUESTION, this.model)
			.then(question => {
				if(medias.length || optionMedias.length) {
					this.saveAttachments(question, medias, optionMedias);
				}else this.onSaved();
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		removeMedia() {
         this.model.medias = [];
      },
		removeAttachments() {
         this.model.attachments = [];
      },
		saveAttachments(question, medias, optionMedias) {
			for(let i = 0; i < question.attachments.length; i++) {
				let attachment = question.attachments[i];
				let media = medias.find(item => item.files[0].name === attachment.name);
				if(media) {
					media.postId = attachment.postId;
					media.postType = attachment.postType;
				}
			}
			question.options.forEach(option => {
				for(let i = 0; i < option.attachments.length; i++) {
					let attachment = option.attachments[i];
					let media = optionMedias.find(item => item.files[0].name === attachment.name);
					if(media) {
						media.postId = attachment.postId;
						media.postType = attachment.postType;
					}
				}	
			});
			this.uploadAttachments(medias.concat(optionMedias));
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
				onError(error);
			})
		},
		onRemove() {
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {}
			});
		},
		submitDelete() {
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_QUESTION, id)
			.then(() => {
				this.$emit('saved', null);	
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		onSaved() {
			this.$emit('saved', this.model);	
		}
	}
}
</script>
