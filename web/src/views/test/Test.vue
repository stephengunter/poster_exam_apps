<template>
	<v-container>
		<v-btn @click=test>Test</v-btn>
		
	</v-container>
</template>

<script>
import { API_URL } from '@/config';
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { SET_AUTH_CHANGED } from '@/store/mutations.type';

import { onError } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {
			messages: 8,
			pay: {
				model: null,
				maxWidth: DIALOG_MAX_WIDTH,
				active: false,
			},
			
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth']),
	},
	beforeMount() {
		
	},
	methods: {
		test() {
			this.$store.commit(SET_AUTH_CHANGED, true);
			// let err = {
			// 	status: 401
			// };
			// onError(err);
			
			
			
		}
	},
	

}
</script>


