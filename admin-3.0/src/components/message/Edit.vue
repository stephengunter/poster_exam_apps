<template>
<validation-observer ref="validator">
	<v-card v-if="ready">
		<core-close-icon-button @close="cancel" />
		<v-card-text>
			<v-container>
				<v-row>
					<h2>原件</h2>
					<v-col cols="12">
						<p>
							<span class="headline">{{ model.subject }}</span>
							<span class="pl-3">{{ model.createdAtText }}</span>
						</p>
					</v-col>
					<v-col cols="12">
						<p>
							{{ model.content }}
						</p>
					</v-col>
				</v-row>
				<v-row>
					<h2>回覆</h2>
					<v-col cols="12">
						<validation-provider v-slot="{ errors }" name="主旨" rules="required">
							<v-text-field label="主旨" v-model="reply.subject" required
							:error-messages="errors"
							/>
						</validation-provider>
					</v-col>
					<v-col cols="12">
						<core-html-editor ref="htmlEditor" :allow_image="false"
						:content="reply.text"
						@changed="onHtmlContentChanged"
						/>

						<validation-provider name="content">
							<core-error-text class="mt-3" :text="getErrMsg('content')" />
						</validation-provider>

						<v-btn class="mt-3" @click.prevent="onPreview" fab small>
							<v-icon>mdi-eye-outline</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<core-error-list />
				<v-row>
					<v-col cols="12">
						<v-checkbox v-model="reply.draft" label="草稿" 
						/>
					</v-col>
				</v-row>
			</v-container>

			<v-dialog v-model="preview.active" :max-width="preview.maxWidth">
				<v-card>
					<v-card-title>
						<span class="headline">{{ preview.title }}</span>
						<v-spacer />
						<v-btn href="#" @click.prevent="cancelPreview" icon>
							<v-icon>mdi-window-close</v-icon>
						</v-btn>
					</v-card-title>
					<v-card-text>
						<v-container>
							<core-html-preview :content="preview.content" />
						</v-container>
					</v-card-text>
					<v-card-actions v-if="!reply.draft" v-show="isValid">
						<v-container>
							<v-btn type="submit" @click.prevent="submit" color="primary">
								發送回覆
							</v-btn>
						</v-container>
					</v-card-actions>
				</v-card>
			</v-dialog>

		</v-card-text>
		<v-card-actions>
			<v-container>
				<v-btn type="submit" @click.prevent="onSubmit" color="primary">
					存檔
				</v-btn>
			</v-container>
		</v-card-actions>
	</v-card>
</validation-observer>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { UPDATE_MESSAGE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { addErrorMsg, getErrorMsg, clearErrors } from '@/utils';

export default {
	name: 'MessageEdit',
	props: {
		model: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			ready: false,

			reply: null,

			isValid: false,
			
			action: '',

			preview: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				content: ''
			},

			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
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
	beforeMount() {
		let returnContent = this.model.returnContentView;
		this.text = returnContent.text;
		this.reply = {
			...returnContent
		};

		this.preview.content = returnContent.template;

		if(!this.reply.subject) this.reply.subject = `Re: ${this.model.subject}`;
		
		this.ready = true;
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		getErrMsg(key) {
			if(this.validator) return getErrorMsg(this.validator.errors, key);
			return '';			
		},
		remove(){
			this.$emit('remove');
		},
		cancel(){
			this.validator.reset();
         this.$emit('cancel');
		},
		onPreview() {
			this.action = 'preview';
			this.showPreview(this.reply.text);
		},
		cancelPreview() {
			this.action = '';
			this.preview.active = false;
		},
		onSubmit() {
			this.isValid = false;
			this.action = 'submit';

         this.validator.validate().then(valid => {
				if(!valid) return;

				let convert = false;
				this.reply.text = this.htmlEditor.getContent(convert);

				let content = this.reply.text;
				if(content && content != `<p></p>`) {
					if(this.reply.draft) {
						//儲存草稿
						this.reply.text = content;
						this.submit();
					}else {
						//發送回覆, 先預覽
						this.isValid = true,
						this.showPreview(content);
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
		showPreview(content) {
			this.preview.title = this.reply.subject;
			this.preview.content = this.reply.template.replace('MAILCONTENT', content);
			this.preview.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.preview.active = true;
		},
		submit() {
			let id = this.model.id;
			let model = this.reply;

			if(!model.draft) {
				model.content = this.preview.content;
			}

			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_MESSAGE, {id, model})
			.then(() => {
				 this.$emit('saved');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		}
	}
}
</script>