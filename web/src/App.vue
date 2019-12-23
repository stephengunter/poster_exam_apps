<template>
  <v-app>
	   <TheDrawer />
		<TheHeader />
		<TheContainer />
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
				msg: 'Server no response. Please try later.'
			},
			success: {
				color: 'success',
				show: false,
				timeout: 1500,
				msg: 'Save successfully'
			}
		}
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
		onSuccess(msg){
			this.success.show = true;
			this.success.msg = msg ? msg : 'Save successfully';
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
</style>
