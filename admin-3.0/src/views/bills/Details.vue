<template>
   <core-container>
		<bill-details v-if="model" :model="model"
		@cancel="back"
		/>
   </core-container>
</template>

<script>
import { BILL_DETAILS } from '@/store/actions.type';
import { tryParseInt, onError } from '@/utils';

export default {
	name: 'BillDetailsView',
	props: ['id'],
	data() {
		return {
			model: null
		}
	},
	beforeMount() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			let id = tryParseInt(this.id);
			this.$store.dispatch(BILL_DETAILS, id)
			.then(model => {
				this.model = model;
			})
			.catch(error => {
				onError(error);
			})
		},
		back() {
			this.$router.push({ name: 'bills' });
		}
   }
}
</script>

<style>

</style>