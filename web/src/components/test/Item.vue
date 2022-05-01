<template>
	<v-container>
		TestItem
		
	</v-container>
</template>

<script>
import BaseService from '@/common/baseService';
import { API_URL } from '@/config';
const source =`${API_URL}/api/atests`;
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, onError } from '@/utils';

export default {
	name: 'TestItem',
	data() {
		return {

		}
	},
	beforeMount() {
		
	},
	methods: {
		test() {
			BaseService.fetch(source)
			.then(model => {
				console.log(model);
			})
			.catch(error => {
				onError(resolveErrorData(error));
			})
		}
	},
	

}
</script>


