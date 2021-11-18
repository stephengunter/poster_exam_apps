<template>
<validation-observer ref="validator">
	<v-card v-if="ready">
		<v-card-title>
			<h3>{{ title }}</h3>
			<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
			<v-spacer />
			<v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-row>
					<v-col cols="6">
						<v-select label="分類"
						:items="category_options" v-model="model.categoryId"
						/>
					</v-col>
					<v-col cols="6">
						<v-radio-group v-model="params.active" row @change="onActiveChanged">
							<v-radio v-for="(item, index) in active_options" :key="index"
							:label="item.text" :value="item.value"
							/>
						</v-radio-group>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="12">
						<validation-provider v-slot="{ errors }" name="標題" rules="required">
							<v-text-field label="標題" v-model="model.title" required
							:error-messages="errors"
							/>
						</validation-provider>
					</v-col>
					<v-col cols="12">
						<core-html-editor ref="htmlEditor"
						:content="model.content"
						@changed="onHtmlContentChanged"
						/>

						<validation-provider name="content">
							<core-error-text class="mt-3" :text="getErrMsg('content')" />
						</validation-provider>

					</v-col>
					<v-col cols="12">
						<v-textarea v-model="model.summary" label="摘要" outlined auto-grow
						name="summary" rows="5" row-height="15"
						/>
					</v-col>
				</v-row>

				<core-error-list />

				
			</v-container>

			<v-dialog v-model="preview.active" :max-width="preview.maxWidth">
				<v-card>
					<v-card-title>
						<h3>{{ preview.title }}</h3>
						<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
						<v-spacer />
						<v-btn @click.prevent="cancelPreview" icon>
							<v-icon>mdi-window-close</v-icon>
						</v-btn>
					</v-card-title>
					<v-card-text>
						<v-container style="height: 480px">
							<iframe style="height: 100%; width: 100%;" class="iframe-window" :src="preview.url">
							</iframe>
						</v-container>
					</v-card-text>
					<v-card-actions v-if="isValid">
						<v-container>
							<v-btn type="submit" @click.prevent="confirmActive" color="warning">
							發送公告
						</v-btn>
						</v-container>
					</v-card-actions>
				</v-card>
			</v-dialog>
			
		</v-card-text>
		<v-card-actions>
			<v-container>
				<v-row>
					<v-col cols="6">
						<v-btn @click.prevent="onSubmit" color="success">
						存檔
						</v-btn>
					</v-col>
					<v-col cols="6" class="text-right">
						<v-btn @click.prevent="onRemove" color="error">
						刪除
						</v-btn>
					</v-col>
				</v-row>
				
			</v-container>
		</v-card-actions>
	</v-card>
</validation-observer>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { STORE_ARTICLE, UPDATE_ARTICLE, DELETE_ARTICLE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH, CLIENT_URL } from '@/config';
import { removeHtmlTags, addErrorMsg, getErrorMsg, clearErrors } from '@/utils';

export default {
	name: 'ArticleEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		version: {
         type: Number,
         default: 0
		},
		category_options: {
         type: Array,
         default: null
		},
		active_options: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
			ready: false,

			params: {
				active: 0
			},

			isValid: false,
			action: '',

			preview: {
				url: '',
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			references: {}
		}
	},
	computed: {
		...mapGetters(['currentUser', 'responsive','contentMaxWidth']),
		title(){
			let text = '文章';

			if(this.model.id) return `編輯${text}`;
			return `新增${text}`;	
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		},
		htmlEditor() {
			if(this.$refs.htmlEditor) return this.$refs.htmlEditor;
			else if (this.references.htmlEditor) return this.references.htmlEditor;
			return null;
      }
	},
	watch: {
      version: 'onVersionChanged'
   },
	beforeMount() {
		this.params.active = this.model.active ? 1 : 0;
		
		this.ready = true;
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		onActiveChanged(val) {
			this.model.active = val > 0;
		},
		getErrMsg(key) {
			if(this.validator) return getErrorMsg(this.validator.errors, key);
			return '';			
		},
		cancelPreview() {
			this.action = '';
			this.preview.active = false;
		},
		cancel(){
			this.validator.reset();
         this.$emit('cancel');
		},
		onSubmit() {
			this.isValid = false;
			this.action = 'submit';
			
         this.validator.validate().then(valid => {
				if(!valid) return;

				let convert = true;
				this.model.content = this.htmlEditor.getContent(convert);
				let clearContent = removeHtmlTags(this.model.content);
				if(clearContent) {
					if(this.model.active) {
						//正式發送, 先預覽
						this.action = 'preview';
						this.isValid = true,
						this.model.active = false;
						this.submit();
					}else {
						//儲存草稿
						this.submit();
					}
				}else {
					this.isValid = false;
					this.addContentError();
				}
         });         
		},
		addContentError(msg = '必須填寫內容') {
			addErrorMsg(this.validator, 'content', msg);
		},
		clearContentError() {
			let errors = clearErrors({ ...this.validator.errors }, ['content']);
			this.validator.setErrors(errors);
		},
		onHtmlContentChanged() {
			this.clearContentError();
		},
		onVersionChanged() {
			if(this.action === 'preview' && this.model.id) {
				this.preview.url = `${CLIENT_URL}/articles/${this.model.id}/${this.currentUser.id}`;
				
				this.preview.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.preview.active = true;
			}
		},
		confirmActive() {
			this.model.active = true;
			this.action = '';
			this.submit();
		},
		submit() {
			let model = this.model;
			console.log(model);
			if(!model.summary) {
				//console.log('summary', this.model.content.substring(0, 150));
				//model.summary = this.model.content.substring(0, 150);
			}

			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(model.id ? UPDATE_ARTICLE : STORE_ARTICLE, model)
			.then(article => {
				if(this.action === 'preview') {
					this.$emit('saved', article);
				}else {
					this.$emit('saved');	
				}
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
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
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_ARTICLE, id)
			.then(() => {
				this.$emit('saved');
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		}
	}
}
</script>
