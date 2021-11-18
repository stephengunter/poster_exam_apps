<template>
	<v-container>
		
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
	name: 'TestDetailsView',
	data() {
		return {
			canBack: false,
		}
	},
	beforeRouteEnter(to, fromRoute, next) {
		next(vm => {
			vm.canBack = fromRoute && fromRoute.name === 'test';
		});
	},
	computed: {
		
	},
	beforeMount() {
		
	},
	methods: {
		back() {
			if(this.canBack && window.history.length) this.$router.go(-1);
			else this.$router.push({ name: 'test' });
		}
	},
	

}
</script>


