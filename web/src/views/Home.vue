<template>
	<v-container fill-height fluid>
		Home {{ num }}

	   <a href="#" @click.prevent="test">Test</a>	

	</v-container>
</template>

<script>
import { REFRESH_TOKEN } from '@/store/actions.type';
import { getRandomInt } from '@/utils';
export default {
	name: 'HomeView',
	data() {
		return {
			num: 0
		}
	},
	beforeMount() {
		let val = getRandomInt(3);
		this.num = val;
	},
	methods: {
		test() {
			this.$store.dispatch(REFRESH_TOKEN)
			.then(val => {
				console.log(val); 
			}).catch(error => {
				console.error(error);
			})
		}
	}
}
</script>
