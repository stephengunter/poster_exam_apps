<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout v-if="ready" justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<exception-header :params="params" :type_options="typeOptions"
					@submit="fetchData"
					/>
					<v-layout row wrap>
						<v-flex xs12>
							<exception-table :list="pagedList.list"
					
							/>
						</v-flex>
					</v-layout>
					<v-flex xs12>
						<core-table-pager v-show="pagedList.list.length > 0"
						:model="pagedList" :responsive="responsive" list_key="list"
						@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
						/>
					</v-flex>
				</material-card>
			</v-flex>
     </v-layout>
	  
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_EXCEPTIONS } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'ExceptionsView',
   data () {
		return {
			ready: false,
			params: {
				type: '',
				start: '',
				end: '',
				page: -1,
				pageSize: 10
			},

			typeOptions: [],
			pagedList: null,
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		firstLoad() {
			return this.params.page < 0;
		}
   },
   beforeMount(){
		this.fetchData();
   },
   methods: {
		onPageChanged(page){
			this.params.page = page;
			this.onParamsChanged();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.onParamsChanged();
		},
		onParamsChanged() {
			this.fetchData();
		},
		fetchData(){
			this.typeOptions = [];
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_EXCEPTIONS, this.params)
			.then(model => {
				this.typeOptions = model.typeOptions;
				this.pagedList = model.pagedList;
				if(this.firstLoad){
					this.params.page = 1;
					this.params.start = model.startDateText;
					this.params.end = model.endDateText;

					
				}

				this.$nextTick(() => {
					this.ready = true;
				})
				
			})
			.catch(error => {
				onError(error);
			})
		},
		
	}
}
</script>

<style>

</style>