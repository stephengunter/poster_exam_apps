<template>
<div>
	<section id="hero">
		<layout-hero />
	</section>
	<section id="about">
		<layout-about />
	</section>
	<section id="features" class="grey lighten-3">
      <layout-features />
   </section>
	<section v-if="!responsive">
		<div class="py-6"></div>
		<v-container class="text-center">
			<h2 class="display-2 font-weight-bold mb-3">
				<span class="cn">手機版</span>
			</h2>
			<v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
				<qrcode :value="siteUrl" :options="{ width: 280 }"></qrcode>
			</v-responsive>
		</v-container>
   </section>
	<section id="subscribe" class="grey lighten-3" v-show="plan">
      <div class="py-6"></div>
		<v-container class="text-center">
			<h2 class="display-2 font-weight-bold mb-3">
				<span class="cn">訂閱會員</span>
			</h2>
			<v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
				<subscribe-plan v-if="plan" :model="plan" color="grey lighten-5" :flat="true"
				@select="onPlanSelected"
				/>
			</v-responsive>
 
			
		</v-container>
   </section>
</div>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SITE_URL } from '@/config';
import { SUBSCRIBES_INDEX, FETCH_PLANS, CHECK_AUTH, REFRESH_TOKEN
} from '@/store/actions.type';


export default {
	name: 'HomeView',
	data() {
		return {
			siteUrl: SITE_URL
		}
	},
	computed:{
		...mapGetters(['isAuthenticated', 'currentUser','responsive', 'plan'])
	},
	beforeMount() {
		if(this.isAuthenticated) {
			this.$store.dispatch(SUBSCRIBES_INDEX)
			.catch(error => {
				if(error && error.status === 401) {
					this.onFourZeroOne();
				}
			})
		}else this.$store.dispatch(FETCH_PLANS);
	},
	methods: {
		onFourZeroOne() {
			this.$store.dispatch(CHECK_AUTH).then(user => {
				if(user){
					this.$store.dispatch(REFRESH_TOKEN).then(token => {	
						if(token) {
							this.$store.dispatch(SUBSCRIBES_INDEX);
						} 
					})
				}
			})
		},
		onPlanSelected(id) {
			this.$router.push({ path: '/subscribes/create', query: { plan: id }}); 
		}
	}
}
</script>
