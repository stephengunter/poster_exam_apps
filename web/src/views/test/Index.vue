<template>
	<v-container>
		<v-row>
			Test
		</v-row>
		<v-row>
			<test-item />
		</v-row>
		
		
	</v-container>
</template>

<script>
import BaseService from '@/common/baseService';
import { API_URL } from '@/config';
const source =`${API_URL}/api/atests`;
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, onError } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {

		}
	},
	beforeMount() {
		this.test();
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


