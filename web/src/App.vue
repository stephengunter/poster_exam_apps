<template>
   <v-app>
  		<TheDrawer />
		<TheHeader />
		<TheContainer />
		<v-overlay :value="loading">
			<div class="text-center">
				<v-progress-circular indeterminate size="48">
				</v-progress-circular>
				<p v-if="loadingText" style="margin:12px">
					{{ loadingText }}
				</p>
			</div>
		</v-overlay>

		<v-snackbar :timeout="success.timeout" top right dark
			:color="success.color" v-model="success.show"
		>
			<v-icon color="white" class="mr-3">
			{{ success.icon }}
			</v-icon>
			<span class="successText cn">
				{{ success.msg  }}
			</span>
		</v-snackbar>
		
		<v-dialog v-model="err.show" :max-width="err.maxWidth">
			<v-card>
				<v-card-title v-if="err.isError" class="headline red lighten-1 pb-5">
					<v-icon color="white" class="mr-3">
						mdi-alert-circle
					</v-icon>
					<span style="color: #fff;">
						{{ err.msg  }}
					</span>
				</v-card-title>
				<v-card-title v-else>
					{{ err.title }}
				</v-card-title>
				<v-card-text v-if="!err.isError">
					{{ err.msg  }}
				</v-card-text>
			</v-card>	
      </v-dialog>

		<v-dialog v-model="loginConfirm.show" :max-width="loginConfirm.maxWidth">
         <v-card>
            <v-card-title>{{ loginConfirm.title }}</v-card-title>
            <v-card-text>
               {{ loginConfirm.text }}
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn  color="green darken-1" text @click="loginConfirmed">
                  OK
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
	</v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CHECK_AUTH, REFRESH_TOKEN, TOKEN_REFRESHED } from '@/store/actions.type';
import { SET_WINDOW_WIDTH, SET_RESPONSIVE, TOGGLE_DRAWER } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

import TheHeader from './components/layout/Header';
import TheDrawer from './components/layout/Drawer';
import TheContainer from './components/layout/Container';

export default {
	name: 'App',
	components: {
		TheHeader,
		TheDrawer,
		TheContainer
	},
	data(){
		return {
			title: '',
			err: {
				isError: true,
				maxWidth: DIALOG_MAX_WIDTH,
				show: false,
				title: '',
				msg: '伺服器暫時無回應，請稍候再試.',
			},
			success: {
				color: 'info',
				show: false,
				timeout: 1500,
				msg: '存檔成功'
			},
			loginConfirm: {
				maxWidth: DIALOG_MAX_WIDTH,
				color: 'info',
				show: false,
				title: '需要登入',
				text: '您目前執行的程序需要登入.',
				returnUrl: ''
			}
		}
	},
	computed:{
		...mapGetters(['currentUser','responsive','contentMaxWidth']),
      ...mapState({
			loading: state => state.app.loading,
			loadingText: state => state.app.loadingText,
			responsive: state => state.app.responsive
      })
	},
	created(){
		Bus.$on('errors', this.onError);
		Bus.$on('success', this.onSuccess);
		Bus.$on('warning', this.onWarning);
		Bus.$on('confirm-login', this.confirmLogin);
	},
	mounted(){
		if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);

      this.onResponsiveInverted();
		window.addEventListener('resize', this.onResponsiveInverted);
	},
	beforeDestroy(){
      window.removeEventListener('resize', this.onResponsiveInverted)
	},
	methods:{
		onError(error) {
			this.err.isError = true;
			this.err.title = '';
			this.err.text = '';
			this.err.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;

			let defaultMsg = '伺服器暫時無回應，請稍候再試.';
			if(!error){
				this.err.msg = defaultMsg;
				this.err.show = true;
				return;
			}
			if(!error.status){
				this.err.msg = error.msg ? error.msg : defaultMsg;
				this.err.show = true;
			}
			if(error.status === 500){
				this.err.msg = defaultMsg;
				this.err.show = true;
			}else if(error.status === 401){
				this.$store.dispatch(CHECK_AUTH).then(auth => {
					console.log('auth', auth);
					if(auth){
						this.$store.dispatch(REFRESH_TOKEN).then(token => {	
							if(token) {
								this.err.title = '請重新操作';
								this.err.msg = '您的驗証剛剛刷新，請重新操作一次';
								this.err.isError = false;
								this.err.show = true;
								Bus.$emit(TOKEN_REFRESHED);
							} 
							else this.$router.push({ name: 'login', query: { returnUrl: this.$route.path } });
						})
					}else {
						//無token
						this.$router.push({ name: 'login', query: { returnUrl: this.$route.path } });
					}
				})
			}
		},
		onSuccess(msg) {
			this.success.icon = 'mdi-check-circle';
			this.success.color = 'success';
			this.success.msg = msg ? msg : '存檔成功';
			this.success.show = true;
		},
		onWarning(msg){
			if(msg) {
				this.success.icon = 'mdi-alert-circle';
				this.success.color = 'warning';
				this.success.msg = msg;
				this.success.show = true;
			}
		},
		confirmLogin(data) {
			if(data) {
				this.loginConfirm.title = data.title ? data.title : '需要登入';
				this.loginConfirm.text = data.text ? data.text : '您目前執行的程序需要登入';
				this.loginConfirm.returnUrl = data.returnUrl ? data.returnUrl : '/';
			}
			this.loginConfirm.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.loginConfirm.show = true;
		},
		loginConfirmed() {
			let returnUrl = this.loginConfirm.returnUrl;
			this.$router.push({ path: '/login', query: { returnUrl }});

			this.loginConfirm.show = false;
		},
		onResponsiveInverted () {
			if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);
			
         if(window.innerWidth < 991) {
            this.$store.commit(SET_RESPONSIVE, true);
         }else {
            this.$store.commit(SET_RESPONSIVE, false);
         }
      },
	}
};
</script>


<style lang="scss">
* :not(.v-icon) {
  font-family: "微軟正黑體",sans-serif!important;
}
html {
  scroll-behavior: smooth;
}

.errText{
	color: #fff;
}
.successText{
	font-size: 1.2rem;
	color: #fff;
}
.center-helper {
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}
.img-center {
	display: block;
	margin: auto;
}

.a-btn {
  text-decoration: none;
}

.q-title {
	font-size: 16px;
}
</style>
