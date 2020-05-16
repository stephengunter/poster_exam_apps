<template>
	<v-card v-if="ready">
		<core-close-icon-button @close="cancel" />
		<v-card-text>
			<v-container grid-list-md>
				<v-layout wrap>
					<span class="font-weight-thin">原件</span>
					<v-flex xs12>
						<p>
							<span class="headline">{{ model.subject }}</span>
							<span class="pl-3">{{ model.createdAtText }}</span>
						</p>
					</v-flex>
					<v-flex xs12>
						<p>
							{{ model.content }}
						</p>
					</v-flex>
				</v-layout>
				<v-layout wrap class="mt-3" >
					<span class="font-weight-thin">回覆</span>
					<v-flex xs12>
						<v-text-field v-model="reply.subject" label="主旨"
						v-validate="'required'"
						:error-messages="getErrMsg('subject')"
						name="subject"
						required
						/>
					</v-flex>
					<v-flex xs12>
						<core-html-editor :content="htmlEditor.content" :version="htmlEditor.version"
						@submit="onHtmlEditorSubmit" @content-changed="onHtmlContentChanged"
						/>

						<core-error-text :text="getErrMsg('content')" />

						<v-btn @click.prevent="onPreview" fab small>
							<v-icon>mdi-eye-outline</v-icon>
						</v-btn>
					</v-flex>
					
				</v-layout>
				
				<core-error-list  />
				<v-layout wrap>
					<v-flex xs6>
						<v-checkbox v-model="reply.draft" label="草稿" 
						/>
					</v-flex>
					<v-flex xs6>
						
					</v-flex>
				</v-layout>
			</v-container>

			<v-dialog v-model="preview.active" :max-width="preview.maxWidth">
				<v-card>
					<v-card-title>
						<span class="headline">{{ preview.title }}</span>
						<v-spacer />
						<a href="#" @click.prevent="cancelPreview">
							<v-icon>mdi-window-close</v-icon>
						</a>
					</v-card-title>
					<v-card-text>
						<core-html-preview :content="preview.content" />
					</v-card-text>
					<v-card-actions v-if="!reply.draft" v-show="isValid">		
						<v-btn type="submit" @click.prevent="submit" color="primary">
							發送回覆
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

		</v-card-text>
		<v-card-actions>		
			<v-btn type="submit" @click.prevent="onSubmit" color="primary">
				存檔
			</v-btn>
		</v-card-actions>
	</v-card>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { UPDATE_MESSAGE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

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

			htmlEditor: {
				content: '',
				version: 0
			},
			
			action: '',

			preview: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				content: ''
			}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth'])
	},
	beforeMount() {
		let returnContent = this.model.returnContentView;
		this.text = returnContent.text;
		this.reply = {
			...returnContent
		};

		this.htmlEditor.content = returnContent.text ? returnContent.text : '';

		this.preview.content = returnContent.template;

		if(!this.reply.subject) this.reply.subject = `Re: ${this.model.subject}`;
		
		this.ready = true;
	},
	methods: {
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('subject', '主旨').replace('content', '內容');
			}
			return '';
		},
		remove(){
			this.$emit('remove');
		},
		cancel(){
			this.errors.clear();
         this.$emit('cancel');
		},
		onPreview() {
			this.action = 'preview';
			this.htmlEditor.version += 1;
		},
		cancelPreview() {
			this.action = '';
			this.preview.active = false;
		},
		onSubmit() {
			
			this.isValid = false;
			this.action = 'submit';
         this.$validator.validate().then(valid => {
				if(valid) this.htmlEditor.version += 1;
				else this.isValid = false;
         });         
		},
		onHtmlContentChanged() {
			this.errors.remove('content');
		},
		onHtmlEditorSubmit(content) {
			
			if(this.action === 'preview') {
				this.showPreview(content);
			}else {
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
					this.errors.add({
						field: 'content',
						msg: '必須填寫內容'
					});
				}
			}
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
