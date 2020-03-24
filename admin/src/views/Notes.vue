<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<note-header ref="noteHeader"
					:version="version"
					@params-changed="fetchData" @refresh="refresh"
					/>
					<div v-if="ready">
						<note-edit v-for="(term, index) in terms" :key="index"
						:term="term" :version="version"
						@show-photo="onShowPhoto" 
						@saved="onSaved" @remove="onRemove"
						@order-updated="onSaved"
						@add-question="editTermQuestions"
						@remove-question="removeTermQuestion"
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
		<v-dialog v-model="showReference.active" :max-width="showReference.maxWidth">
			<v-card v-if="showReference.model">
				<v-card-text v-if="showReference.type.toLowerCase() === 'term'">
					<h3 v-if="showReference.model.subject" style="margin-top: 5px;">{{ showReference.model.subject.title }}  {{ showReference.model.title }}</h3>
					<term-tree-item :item="showReference.model" 
					:show_title="false" :max_width="showReference.maxWidth" 
					/>
				</v-card-text>
				<v-card-text v-else>
					<h3 v-if="showReference.model.title" style="margin-top: 5px;">{{ showReference.model.title }}</h3>
					<note-read :model="showReference.model"/>
				</v-card-text>
      	</v-card>
		</v-dialog>
		<v-dialog v-model="termQuestions.active" :max-width="termQuestions.maxWidth">
			<term-question-edit :term="termQuestions.term"
			:version="termQuestions.version"
			@cancel="termQuestions.active = false" @saved="onTermQIdUpdated"
			/>
		</v-dialog>
	</v-container>
    
	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_NOTES, DELETE_NOTE, SHOW_TERM, SHOW_NOTE,
TERM_DETAILS, NOTE_DETAILS, DELETE_TERM_QUESTION
} from '@/store/actions.type';

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

			ready: false,
			version: 0,

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

			showPhoto: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			showReference: {
				active: false,
				type: '',
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			showTerm: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			termQuestions: {
				term: null,
				version: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			terms: state => state.notes.terms
		}),
		noteHeader() {
			if(this.$refs.noteHeader) return this.$refs.noteHeader;
			else if (this.references.noteHeader) return this.references.noteHeader;
			return null;
      },
	},
	mounted() {
		this.references = { ...this.$refs };
		window.addEventListener(SHOW_TERM, this.onShowTerm);
		window.addEventListener(SHOW_NOTE, this.onShowNote);
	},
	beforeDestroy(){
		window.removeEventListener(SHOW_TERM, this.onShowTerm);
		window.removeEventListener(SHOW_NOTE, this.onShowNote);
   },
	methods: {
		fetchData({ subject, term, keyword }) {
			this.ready = false;
			let params = {
				subject, term, keyword
			};
			this.params = params;
			this.$store.dispatch(FETCH_NOTES, params)
			.then(terms => {
				this.$nextTick(() => {
					this.setReady(true);
				});
			})
			.catch(error => {
				onError(error);
			})
		},
		setReady(val) {
			if(val) {
				this.ready = true;
				this.version += 1;
			}else {
				this.ready = false;
			}
		},
		refresh() {
			this.fetchData(this.params);
		},
		onShowPhoto(photo) {
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
		},
		onShowTerm(e) {
			let id = e.detail.id;
			let term = this.terms.find(item => item.id === Number(id));
			if(term) {
				this.showReference.model = term;
				this.showReference.type = 'term';
				this.showReference.active = true;
			}else {
				this.$store.dispatch(TERM_DETAILS, id)
				.then(model => {
					this.showReference.model = model;
					this.showReference.type = 'term';
					this.showReference.active = true;

					console.log('this.showReference', this.showReference);
				})
				.catch(error => {
					onError(error);
				})
			}
			
		},
		onShowNote(e) {
			let id = e.detail.id;
			this.$store.dispatch(NOTE_DETAILS, id)
				.then(model => {
					this.showReference.model = model;
					this.showReference.type = 'note';
					this.showReference.active = true;
				})
				.catch(error => {
					onError(error);
				})
			
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
		},
		editTermQuestions(id) {
			this.termQuestions.term = this.terms.find(item => item.id === id);
			this.termQuestions.version += 1;
			this.termQuestions.active = true;
		},
		removeTermQuestion(model) {
			let term = this.terms.find(item => item.id === model.termId);

			this.$store.dispatch(DELETE_TERM_QUESTION, model)
			.then(() => {
				this.refresh();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		onTermQIdUpdated() {
			this.termQuestions.active = false;
			this.termQuestions.term = null;
			this.refresh();
		}
	}
}
</script>