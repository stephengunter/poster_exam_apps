<template>
   <core-container>
		Subscribes
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { } from '@/store/actions.type';

export default {
   name: 'SubscribesView',
   data () {
		return {
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			
		})
   },
   beforeMount(){
		this.init();
   },
   methods: {
		init(){
			
		},
		fetchData(params){
			
		}
	}
}
</script>