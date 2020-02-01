<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<note-header ref="noteHeader" 
					:params="params" :index_model="indexModel"
					@params-changed="onParamsChanged"
					/>
					
					<note-edit v-for="(term, index) in terms" :key="index"
					:term="term"
					/>
						
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
			},

			indexModel: null,
			terms: [],
			headers: [
            {
					sortable: false,
					text: '附圖',
               value: '',
               width: '15%'
            },
				{
					sortable: false,
					text: '內容',
               value: '',
               width: '30%'
            },
            {
					sortable: false,
					text: '重點標記',
               value: '',
               width: '30%'
            },
            {
					sortable: false,
					text: '資料來源',
               value: '',
               width: '15%'
            },
            {
               width: '50px',
					sortable: false,
					text: '',
					value: ''
				}
         ],
			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		firstLoad() {
			return this.params.subject < 1;
		},
		noteHeader() {
			if(this.$refs.noteHeader) return this.$refs.noteHeader;
			else if (this.references.noteHeader) return this.references.noteHeader;
			return null;
      },
	},
	beforeMount(){
		this.fetchData();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		init(){
			
			
		},
		fetchData(params) {
			if(!params) params = this.params;

			this.$store.dispatch(FETCH_NOTES, params)
			.then(model => {
				if(this.firstLoad) {
					this.indexModel = model;
					this.$nextTick(() => {
						this.noteHeader.init();
					});
				}else {
					if(model.subItems.length) {
						this.terms = model.subItems;
					}else {
						this.terms = [model];
					}
				}
				
			})
			.catch(error => {
				onError(error);
			})
		},
		onParamsChanged(params) {
			this.fetchData(params);
			this.params = { ...params };
		}
	}
}
</script>