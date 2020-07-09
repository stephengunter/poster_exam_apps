<template>
	<v-container>
		Test
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmptyObject } from '@/utils';

export default {
	name: 'TestView',
	data() {
		return {

		}
	},
	beforeMount() {
		Bus.$emit('errors');
		
	},
	methods: {
		test() {
			console.log(this.tree);
		}
	},
	

}
</script>


