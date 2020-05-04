<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row wrap>
						<v-flex xs12>
							<v-select label="資料"
								:items="typeOptions" v-model="params.type"
								@change="onTypeChanged"
							/>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs12>
							
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_PAYAPP_REQUESTS } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'PayAppView',
   data () {
		return {
			params: {
				type: 'Requests'
			},
			typeOptions: [{
				value: 'Requests',
				text: 'Requests'
			},{
				value: 'Reports',
				text: 'Reports'
			},{
				value: 'Exceptions',
				text: 'Exceptions'
			}],
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth'])
   },
   beforeMount(){
		//this.fetchData();
   },
   methods: {
		onTypeChanged(val) {
			console.log('onTypeChanged', val);
      },
		fetchData(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_PLANS, this.params)
			.catch(error => {
				onError(error);
			})
		},
		
	}
}
</script>

<style>

</style>