<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<note-header ref="noteHeader" 
					:params="params" :index_model="indexModel"
					@params-changed="onParamsChanged"
					/>
					
					<div v-if="ready">
						<note-edit v-for="(term, index) in terms" :key="index"
						:term="term" :version="version"
						@show-photo="onShowPhoto" 
						@saved="onSaved" @remove="onRemove"
						/>
					</div>	
				</material-card>
			</v-flex>
      </v-layout>
		<v-dialog v-model="deletion.active" :max-width="deletion.maxWidth">
			<core-confirm @ok="remove" @cancel="cancelRemove" />
		</v-dialog>
		<v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
			<v-card v-if="showPhoto.model">
				<v-card-title>
					<span class="title">{{ showPhoto.model.title }}</span>
					<v-spacer />
					<a href="#" @click.prevent="showPhoto.active = false" class="a-btn">
						<v-icon>mdi-window-close</v-icon>
					</a>
				</v-card-title>
				<v-card-text>
					<v-img class="img-center" :src="showPhoto.model.id | photoIdUrl"
					 :max-width="showPhoto.model.width"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_NOTES, DELETE_NOTE } from '@/store/actions.type';

import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
	name: 'NotesView',
	data () {
		return {
			params: {
				subject: 0,
				term: 0,
				keyword: ''
			},

			indexModel: null,
			terms: [],
			version: 0,
			ready: false,

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
			references: {},

			showPhoto: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			}
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
			this.ready = false;
			this.$store.dispatch(FETCH_NOTES, params)
			.then(model => {
				if(this.firstLoad) {
					this.indexModel = model;
					this.$nextTick(() => {
						this.ready = true;
						this.noteHeader.init();
					});
				}else {
					this.terms = model;
					this.$nextTick(() => {
						this.ready = true;
						this.version += 1;
					});
					
				}
				
			})
			.catch(error => {
				onError(error);
			})
		},
		onParamsChanged() {
			this.fetchData(this.params);
		},
		onShowPhoto(photo) {
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
		},
		onRemove(item) {
			this.deletion.id = item.id;
			this.deletion.active = true;
		},
		cancelRemove() {
			this.deletion.id = 0;
			this.deletion.active = false;
		},
		remove() {
			let id = this.deletion.id;
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(DELETE_NOTE, id)
			.then(() => {
				this.cancelRemove();
				this.onSaved();
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
		onSaved() {
			this.fetchData(this.params);
		}
	}
}
</script>