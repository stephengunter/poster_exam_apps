<template>
	<core-container>
		<note-header ref="noteHeader"
		:version="version"
		@params-changed="fetchData" @refresh="refresh"
		/>
		<div v-if="ready">
			<note-edit v-for="(term, index) in terms" :key="index"
			:term="term"
			@saved="onSaved"
			@order-updated="onSaved"
			@add-question="editTermQuestions"
			@remove-question="removeTermQuestion"
			/>
		</div>
		
		<v-dialog v-model="termQuestions.active" :max-width="termQuestions.maxWidth">
			<term-question-edit v-if="termQuestions.term" :term="termQuestions.term"
			@cancel="editTermQuestions(0)" @saved="onTermQIdUpdated"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_NOTES, DELETE_NOTE, SHOW_PHOTO,
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

			termQuestions: {
				term: null,
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
		onSaved() {
			this.fetchData(this.params);
		},
		editTermQuestions(id) {
			if(id) {
				this.$store.commit(CLEAR_ERROR);

				this.termQuestions.term = this.terms.find(item => item.id === id);
				this.termQuestions.active = true;
			}else {
				this.termQuestions.term = null;
				this.termQuestions.active = false;
			}
		},
		removeTermQuestion(model) {
			let term = this.terms.find(item => item.id === model.termId);
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(DELETE_TERM_QUESTION, model)
			.then(() => {
				this.refresh();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		onTermQIdUpdated() {
			this.editTermQuestions(0);

			this.refresh();
		}
	}
}
</script>