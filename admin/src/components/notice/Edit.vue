<template>
	<v-card v-if="ready">
		<v-card-title>
				<span class="headline">{{ title }}</span>
				<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
				<v-spacer />
				<a href="#" @click.prevent="cancel">
					<v-icon>mdi-window-close</v-icon>
				</a>
			</v-card-title>
		<v-card-text>
			<v-container grid-list-md>
				<v-layout wrap>
					<v-flex xs12>
						<v-text-field v-model="model.title" label="標題"
						v-validate="'required'"
						:error-messages="getErrMsg('title')"
						name="title"
						required
						/>
					</v-flex>
					<v-flex xs12>
						<span class="font-weight-thin">內容</span>
						<core-html-editor :content="htmlEditor.content" :version="htmlEditor.version"
						@submit="onHtmlEditorSubmit" @content-changed="onHtmlContentChanged"
						/>
						<core-error-text :text="getErrMsg('content')" />

						<v-btn @click.prevent="onPreview" fab small>
							<v-icon>mdi-eye-outline</v-icon>
						</v-btn>

					</v-flex>
					<v-flex xs12>
						<v-checkbox v-model="model.top" label="置頂" 
						/>
					</v-flex>
				</v-layout>

				<core-error-list  />

				<v-layout wrap>
					<v-flex xs6>
						<v-radio-group v-model="params.open" row>
							<v-radio v-for="(item, index) in open_options" :key="index"
							:label="item.text" :value="item.value" readonly
							/>
						</v-radio-group>
					</v-flex>
					<v-flex xs6>
						<v-radio-group v-model="params.active" row>
							<v-radio v-for="(item, index) in active_options" :key="index"
							:label="item.text" :value="item.value"
							@change="onActiveChanged"
							/>
						</v-radio-group>
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
						<iframe class="iframe-window" :src="preview.url">
                  </iframe>
					</v-card-text>
					<v-card-actions v-if="isValid">		
						<v-btn type="submit" @click.prevent="confirmActive" color="warning">
							發送公告
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-dialog v-model="deletion.active" :max-width="deletion.maxWidth">
				<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
			</v-dialog>
		</v-card-text>
		<v-card-actions>		
			<v-btn @click.prevent="onSubmit" color="primary">
				存檔
			</v-btn>
			<v-spacer />
			<v-btn @click.prevent="onRemove" color="error">
				刪除
			</v-btn>
		</v-card-actions>
	</v-card>
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { STORE_NOTICE, UPDATE_NOTICE, DELETE_NOTICE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH, CLIENT_URL } from '@/config';

export default {
	name: 'NoticeEdit',
	props: {
		model: {
         type: Object,
         default: null
		},
		version: {
         type: Number,
         default: 0
		},
		open_options: {
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
				open: 1,
				active: 0
			},

			isValid: false,
			draft: true,
			htmlEditor: {
				content: '',
				version: 0
			},

			action: '',

			deletion: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			preview: {
				url: '',
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				content: ''
			}
		}
	},
	computed: {
		...mapGetters(['currentUser', 'responsive','contentMaxWidth']),
		title(){
			let text = '公告訊息';

			if(this.model.id) return `編輯${text}`;
			return `新增${text}`;	
		},
	},
	watch: {
      version: 'onVersionChanged'
   },
	beforeMount() {
		
		this.params.open = this.model.public ? 1 : 0;
		this.params.active = this.model.active ? 1 : 0;

		this.htmlEditor.content = this.model.content;
		
		this.ready = true;
	},
	methods: {
		onActiveChanged(val) {
			this.model.active = val > 0;
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('title', '標題').replace('content', '內容');
			}
			return '';
		},
		onPreview() {
			this.action = 'preview';
			this.htmlEditor.version += 1;
		},
		cancelPreview() {
			this.action = '';
			this.preview.active = false;
		},
		cancel(){
			this.errors.clear();
         this.$emit('cancel');
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
				this.model.content = content;
				this.model.active = false;
				this.submit();
			}else {
				if(content && content != `<p></p>`) {
					if(!this.model.active) {
						//儲存草稿
						
						this.model.content = content;
						this.submit();
					}else {
						//發送回覆, 先預覽
						this.action = 'preview';
						this.isValid = true,
						this.model.content = content;
						this.model.active = false;
						this.submit();
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
		onVersionChanged() {
			if(this.action === 'preview' && this.model.id) {
				this.preview.url = `${CLIENT_URL}/notices/${this.model.id}/${this.currentUser.id}`;
				
				this.preview.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.preview.active = true;
			}
		},
		showPreview(content) {
			this.preview.title = this.model.title;
			this.preview.content = content;
			this.preview.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.preview.active = true;
		},
		confirmActive() {
			this.model.active = true;
			this.action = '';
			this.submit();
		},
		submit() {
			let model = this.model;

			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(model.id ? UPDATE_NOTICE : STORE_NOTICE, model)
			.then(notice => {
				
				if(this.action === 'preview') {
					this.$emit('saved', notice);
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
			if(this.contentMaxWidth) {
				if(this.responsive)  this.deletion.maxWidth = this.contentMaxWidth; 
				else this.deletion.maxWidth = this.contentMaxWidth * 0.6;
			}
			this.deletion.active = true;
		},
		cancelDelete(){
			this.deletion.active = false;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.model.id;
			this.$store.dispatch(DELETE_NOTICE, id)
			.then(() => {
				this.cancelDelete();
				this.$emit('saved');
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		}
	}
}
</script>
