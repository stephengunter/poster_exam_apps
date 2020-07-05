<template>
   <v-container>
      <note-header ref="noteHeader"
		:version="version" :title="title"
      @params-changed="fetchData"
      />

      <div v-if="ready">
			<note-list v-for="(term, index) in termList" :key="index"
			:mode="params.mode"
			:term="term" :max_width="contentMaxWidth - 65"
			@show-photo="onShowPhoto"
			/>
			
		</div>
		<div id="related-questions" style="padding-top:16px">
			<note-questions ref="relatedQuestions"
			:term_id="params.term" :subject_id="params.subject"
			@show-photo="onShowPhoto"
			/>
		</div>
		<v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
			<photo-show :model="showPhoto.model" @cancel="showPhoto.active = false" />
		</v-dialog>
      <v-dialog v-model="showTerm.active" :max-width="showTerm.maxWidth">
			<term-show :model="showTerm.model" :max_width="showTerm.maxWidth"
			@cancel="showTerm.active = false"
			/>
		</v-dialog>
		<v-dialog v-model="showReference.active" :max-width="showReference.maxWidth">
			<note-show :model="showReference.model"
			@cancel="showReference.active = false"
			/>
		</v-dialog>

		
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_ACTIONS, FETCH_NOTES, NOTE_CATEGORY,
SHOW_TERM, SHOW_NOTE, TERM_DETAILS, NOTE_DETAILS, 
ACTION_SELECTED, SEE_QUESTIONS
} from '@/store/actions.type';
import { onError, resolveErrorData, getRouteTitle } from '@/utils';
import { DIALOG_MAX_WIDTH, NOTES_SETTINGS } from '@/config';

export default {
   name: 'NotesView',
   data() {
		return {
			pageName: 'notes',
			title: '',
         params: {
				mode: 0,
				subject: 0,
				term: 0,
				keyword: ''
			},

			subjectSettings: null,

			ready: false,
			version: 0,

			showPhoto: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
			},

			showTerm: {
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

			questions: {
				page: 1,
				pageSize: 10,
				pageList: [],
				showAnswers: false,
				callback: null
			},

			references: {}
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			terms: state => state.notes.terms
		}),
		termList() {
			if(!this.terms) return [];
			if(!this.subjectSettings) return [];
			if(this.subjectSettings.showTerm) return this.terms;
			return this.terms.filter(item => item.notes && item.notes.length);
		},
		noteHeader() {
			if(this.$refs.noteHeader) return this.$refs.noteHeader;
			else if (this.references.noteHeader) return this.references.noteHeader;
			return null;
		},
		relatedQuestions() {
			if(this.$refs.relatedQuestions) return this.$refs.relatedQuestions;
			else if (this.references.relatedQuestions) return this.references.relatedQuestions;
			return null;
      },
		hasMoreQuestions() {
			if(!this.questionsModel) return false;
			return this.questionsModel.hasNextPage;
		}
	},
   created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
	beforeMount() {
		this.init();	
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
		init() {
			this.pageName = this.$route.name;
			this.title = getRouteTitle(this.$route);
			
			this.setActions();
		},
		setActions() {
			let types = [NOTE_CATEGORY, SEE_QUESTIONS];
			this.$store.dispatch(LOAD_ACTIONS, [types]);
		},
      fetchData({ mode, rootSubject, subject, term, keyword }) {
			this.setSubjectSettings(rootSubject);
			this.setReady(false);
			if(this.relatedQuestions) this.relatedQuestions.init();

			let params = {
				mode, subject, term, keyword
			};
			this.params = params;
			
			this.$store.dispatch(FETCH_NOTES, params)
			.then(terms => {
				if(this.params.keyword) {
					this.$nextTick(() => {
						this.setReady(true);
					});
				}else {
					this.$nextTick(() => {
						this.relatedQuestions.fetchData();
						this.setReady(true);
					});
				}
			})
			.catch(error => {
				Bus.$emit('errors', resolveErrorData(error));
			})
		},
		setSubjectSettings(subjectId) {
			this.subjectSettings = NOTES_SETTINGS.subjects.find(item => item.id === subjectId);
		},
		setReady(val) {
			if(val) {
				this.ready = true;
				this.version += 1;
			}else {
				this.ready = false;
			}
		},
		onActionSelected(name) {
			if(this.$route.name !== this.pageName) return;
			
			if(name === NOTE_CATEGORY) this.noteHeader.showCategory();
			else if(name === SEE_QUESTIONS) this.seeQuestions();
		},
		seeQuestions() {
			var element = document.getElementById('related-questions');
         if(!element) return;
         element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest'});
		},
		onShowPhoto(photo) {
			this.showPhoto.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
		},
		onShowTerm(e) {
			let id = e.detail.id;
			let term = this.terms.find(item => item.id === Number(id));
			if(term) {
				this.showTermDialog(term);
			}else {
				this.$store.dispatch(TERM_DETAILS, id)
				.then(model => {
					this.showTermDialog(model);
				})
				.catch(error => {
					onError(error);
				})
			}
		},
		showTermDialog(term) {
			this.showTerm.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.showTerm.model = term;
			this.showTerm.active = true;
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
			
		}
      
	}
}
</script>