<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				
			</v-col>
		</v-row>

		
		
	</v-container>
</template>

<script>
import BaseService from '@/common/baseService';
import { API_URL, APP_CLOSED, PRODUCTION, SITE_URL, SITE_TITLE,  GOOGLE_AUTH_PARAMS, GOOGLE_RECAPTCHA_PARAMS} from '@/config';
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
			console.log('env', process.env.NODE_ENV);
			console.log('APP_CLOSED', APP_CLOSED);
			console.log('PRODUCTION', PRODUCTION);
			console.log('SITE_URL', SITE_URL);
			console.log('SITE_TITLE', SITE_TITLE);
			console.log('API_URL', API_URL);

			
			console.log('GOOGLE_AUTH_PARAMS', GOOGLE_AUTH_PARAMS);
			console.log('GOOGLE_RECAPTCHA_PARAMS', GOOGLE_RECAPTCHA_PARAMS);
			
		}
	},
	

}
</script>


