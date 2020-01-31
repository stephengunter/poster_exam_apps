<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<!-- <note-header ref="noteHeader" 
					:params="params"
					/> -->
					
					
						
				</material-card>
			</v-flex>
      </v-layout>
		
	</v-container>
    
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

import { FETCH_NOTES } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'NotesView',
	data () {
		return {
			params: {
				subject: 0,
				term: 0
			}

			
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
	},
	beforeMount(){
		this.fetchData();
	},
	methods: {
		init(){
			
			
		},
		fetchData() {
			this.$store.dispatch(FETCH_NOTES, this.params)
			.then(model => {
				console.log(model);
			})
			.catch(error => {
				onError(error);
			})
		}
	}
}
</script>