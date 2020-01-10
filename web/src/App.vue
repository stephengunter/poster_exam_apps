<template>
  <v-app>
	   <TheDrawer />
		<TheHeader />
		<TheContainer />

		<v-overlay :value="loading">
			<v-progress-circular indeterminate size="48"></v-progress-circular>
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
		
		<v-dialog v-model="err.show" width="480">
         <v-card-title class="headline red lighten-1" >
				<v-icon color="white" class="mr-3">
					mdi-alert-circle
				</v-icon>
				<span class="errText">
					{{ err.msg  }}
				</span>
         </v-card-title>
      </v-dialog>
	</v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_WINDOW_WIDTH, SET_RESPONSIVE, TOGGLE_DRAWER } from '@/store/mutations.type';

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
				show: false,
				msg: '伺服器暫時無回應，請稍候再試.'
			},
			success: {
				color: 'info',
				show: false,
				timeout: 1500,
				msg: '存檔成功'
			}
		}
	},
	computed:{
		...mapGetters(['currentUser']),
      ...mapState({
			loading: state => state.app.loading,
			responsive: state => state.app.responsive
      })
	},
	created(){
		Bus.$on('errors', this.onError);
		Bus.$on('success', this.onSuccess);
		Bus.$on('warning', this.onWarning);
	},
	mounted(){
		if(window.innerWidth) this.$store.commit(SET_WINDOW_WIDTH, window.innerWidth);

      this.onResponsiveInverted()
      window.addEventListener('resize', this.onResponsiveInverted)
	},
	beforeDestroy(){
      window.removeEventListener('resize', this.onResponsiveInverted)
	},
	methods:{
		onError(error) {
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
				this.$router.push({ name: 'login', query: { returnUrl: this.$route.path } })
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

.errText{
	color: #fff;
}
.successText{
	font-size: 1.2rem;
	color: #fff;
}
</style>
