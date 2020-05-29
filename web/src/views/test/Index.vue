<template>
	<v-container>
		<v-btn @click=test>Test</v-btn>
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmptyObject } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {
			params: {
				status: -1,
				subject: -1,
				sortBy: 'lastUpdated',
				desc: true,
				page: -1,
				pageSize: 10
			}
		}
	},
	computed: {
		
	},
	beforeMount() {
		let query = this.$route.query;
		if(query && !isEmptyObject(query)) {
			for (let field in this.params) {
				if(query.hasOwnProperty(field)) {
					this.params[field] = query[field]
				}
			}
		}

		console.log('beforeMount', this.params);
		
	},
	methods: {
		test() {
			this.$router.push({ path: '/test/details' });
			
			
		}
	},
	

}
</script>


