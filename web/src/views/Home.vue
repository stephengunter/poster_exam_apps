<template>
	<v-container>
		
	</v-container>
</template>

<script>
import { GOOGLE_AUTH_PARAMS } from '@/config';
export default {
	name: 'HomeView',
	data() {
		
	},
	created(){
		
	},
	beforeMount() {
		this.$router.push({ path: '/rqs' });
	},
	methods: {

	}
}
</script>
