<template>
	<v-app>
		<loading :active.sync="loading"></loading>
		
		<core-toolbar :user="currentUser" :title="title" :responsive="responsive"/> 

		<core-drawer :menus="menus" :responsive="responsive" />

		<core-view />

		<v-snackbar :timeout="success.timeout"
			:color="success.color"
			:top="true"
			v-model="success.show"
			dark
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
				<span class="errText cn">
					{{ err.msg  }}
				</span>
         </v-card-title>
      </v-dialog>
	</v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_WINDOW_WIDTH, SET_RESPONSIVE } from '@/store/mutations.type';

export default {
	name:'App',
	data(){
		return {
			title: '',
			err: {
				show: false,
				msg: 'Server no response. Please try later.'
			},
			success: {
				icon: 'mdi-check-circle',
				color: 'success',
				show: false,
				timeout: 1500,
				msg: 'Save successfully'
			}
		}
	},
	watch:{
      '$route' (val) {
         this.title = val.meta.title;
      }
   },
	computed:{
		...mapGetters(['currentUser', 'menus']),
      ...mapState({
			loading: state => state.app.loading,
			responsive: state => state.app.responsive,
			image: state => state.app.image,
			color: state => state.app.color,
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
		onError(error){
			
			if(!error){
				this.err.msg = 'Server no response. Please try later.';
				this.err.show = true;
				return;
			}
			if(!error.status){
				this.err.msg = error.msg ? error.msg : 'Server no response. Please try later.';
				this.err.show = true;
			}
			if(error.status === 500){
				this.err.msg = 'Server no response. Please try later.';
				this.err.show = true;
			}else if(error.status === 401){
				this.$router.push({ name: 'login' })
			}
		},
		onWarning(msg){
			if(msg) {
				this.success.icon = 'mdi-alert-circle';
				this.success.color = 'warning';
				this.success.msg = msg;
				this.success.show = true;
			}
		},
		onSuccess(msg){
			this.success.icon = 'mdi-check-circle';
			this.success.color = 'success';
			this.success.msg = msg ? msg : 'Save successfully';
			this.success.show = true;
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
}
</script>


<style lang="scss">
* :not(.v-icon) {
  font-family: "微軟正黑體",sans-serif!important;
}
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}

.errText{
	color: #fff;
}
.successText{
	font-size: 1.2rem;
	color: #fff;
}
.cn {
   font-family: "微軟正黑體", "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.img-center {
	display: block;
	margin-left: auto;
	margin-right: auto
}

</style>
