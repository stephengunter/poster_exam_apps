<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<v-alert outlined type="error"  prominent icon="mdi-tools">
					系統維護中，暫時停止服務。
				</v-alert>
			</v-col>
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
			
		}
	},
	

}
</script>


