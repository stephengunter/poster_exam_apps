<template>
   <v-container>
		<div v-if="saved">
			<div class="mb-2">
				<core-bread />
			</div>
			<v-row>
				<v-col cols="12">
					<v-alert prominent border="right" colored-border type="success" elevation="2">
						<v-row align="center">
							<v-col class="grow">
								您的來信已存檔，我們會盡快回覆您.
							</v-col>
						</v-row>
					</v-alert>
				</v-col>
			</v-row>
		</div>
		
		
		<div v-else>
			<v-card>
				<v-card-title class="font-weight-black">
					<span style="font-size:1.3em" >聯絡我們</span>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="12"> 
							<v-text-field v-if="currentUser" label="Email" 
							v-model="model.message.email" readonly
							/>
							<v-text-field v-else label="Email" placeholder="請填寫您的Email"
							v-model="model.message.email"
							v-validate="'required|email'"
							:error-messages="getErrMsg('email')"
							name="email"
							required
							/>
						</v-col>
						<v-col cols="12">
							<v-text-field label="主旨" name="subject"
							v-model="model.message.subject"
							v-validate="'required'"
							:error-messages="getErrMsg('subject')"
							required
							placeholder="請填寫您留言的主旨"
							/>
						</v-col>
						<v-col cols="12">
							<v-textarea label="內容" name="content"
							v-model="model.message.content"
							v-validate="'required'"
							:error-messages="getErrMsg('content')"
							required
							/>
						</v-col>
						<v-col cols="12">
							<core-recaptcha ref="recaptcha"
							@token-changed="onTokenChanged"
							/>
							<span v-if="recaptchaError" class="red--text">請完成驗證</span>
						</v-col>
					</v-row>
					<core-error-list  />
						<v-btn color="success" large @click="onSubmit">
							確認送出
						</v-btn>
					<v-row>
					</v-row>
				</v-card-text>
			</v-card>
      </div>
   </v-container>
</template>

<script>
import sanitizeHtml from 'sanitize-html';
import { mapState, mapGetters } from 'vuex';
import { STORE_MESSAGE } from '@/store/actions.type';
import { isBadRequest, resolveErrorData, getRouteTitle } from '@/utils';
import { SET_BREAD_ITEMS, SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';

export default {
	name: 'ContactView',
	data(){
		return {

			model: {
				message: {
					email: '',
					subject: '',
					content: ''
				},
				token: ''
			},

			recaptchaError: false,
			saved: false,

			references: {}
		}
	},
   computed:{
		...mapGetters(['currentUser']),
		recaptcha() {
			if(this.$refs.recaptcha) return this.$refs.recaptcha;
			else if (this.references.recaptcha) return this.references.recaptcha;
			return null;
		},
	},
	beforeMount() {
		if(this.currentUser) this.model.message.email = this.currentUser.email;

		this.title = getRouteTitle(this.$route);
		this.setTitle();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		setTitle() {
			let items = [{
				action: '', text: this.title
			}];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('email', 'Email').replace('subject', '主旨').replace('content', '內容');
			}
			return '';
		},
		onSubmit() {
			this.$validator.validate().then(valid => {
				if(!valid) return;

				if(!this.model.token) {
					this.recaptchaError = true;
					return;
				}

				let message = {
					email: this.model.message.email,
					subject: sanitizeHtml(this.model.message.subject),
					content: sanitizeHtml(this.model.message.content)
				};

				let token = this.model.token;

				this.submit({
					message,
					token
				});
			});
		},
		submit(model) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(STORE_MESSAGE, model)
			.then(id => {
				Bus.$emit('success');
				this.saved = true;
         })
			.catch(error => {
				let badRequestData = null;
				if(isBadRequest(error)) badRequestData = error.data;
				if(badRequestData) {
					this.$store.commit(SET_ERROR, badRequestData);
				}else {
					Bus.$emit('errors', error);
            }
         })
		},
		onTokenChanged(token) {
			this.model.token = token;
			if(token) this.recaptchaError = false;
		},
		resetRecaptcha () {
			this.$refs.recaptcha.reset();
		}
   }
}
</script>

<style>

</style>