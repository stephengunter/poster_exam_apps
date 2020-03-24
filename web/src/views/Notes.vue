<template>
   <v-container>
      <note-header ref="noteHeader"
		:version="version" :title="title"
      @params-changed="fetchData"
      />

      <div v-if="ready">
			<note-list v-for="(term, index) in terms" :key="index"
			:term="term" :max_width="contentMaxWidth - 65"
			@show-photo="onShowPhoto"
			/>
			<div id="related-questions">
				<v-card v-show="questions.length">
					<v-card-text>
						<v-row>
							<v-col cols="6">
								<h3>相關試題</h3>
							</v-col>
							<v-col cols="6" class="text-right">
								<v-btn :color="showQuestionAnswers ? 'default' : 'info'" outlined @click.prevent="showQuestionAnswers = !showQuestionAnswers">
									{{ showQuestionAnswers ? '隱藏答案' : '顯示答案'}}
								</v-btn>
							</v-col>
						</v-row>
						<question-edit v-for="(question, index) in questions" :key="index"
						:index="index + 1" :read_only="showQuestionAnswers"
						:element_id="`q_${question.index}`"
						:model="question"
						/>
						<v-row v-if="questions.length >= 5">
							<v-col cols="6">
								
							</v-col>
							<v-col cols="6" class="text-right">
								<v-btn :color="showQuestionAnswers ? 'default' : 'info'" outlined @click.prevent="showQuestionAnswers = !showQuestionAnswers">
									{{ showQuestionAnswers ? '隱藏答案' : '顯示答案'}}
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>	
			</div>
		</div>

		<v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
			<photo-show :model="showPhoto.model" @cancel="showPhoto.active = false" />
		</v-dialog>
      <v-dialog v-model="showTerm.active" :max-width="showTerm.maxWidth">
			<term-show :model="showTerm.model" :max_width="showTerm.maxWidth"
			@cancel="showTerm.active = false"
			/>
		</v-dialog>

		
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_ACTIONS, FETCH_NOTES, NOTE_CATEGORY, FETCH_QUESTIONS,
SHOW_TERM, TERM_DETAILS, ACTION_SELECTED, SEE_QUESTIONS
} from '@/store/actions.type';
import { SET_QUESTIONS } from '@/store/mutations.type';
import { onError, resolveErrorData, getRouteTitle } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'NotesView',
   data() {
		return {
			title: '',
         params: {
				subject: 0,
				term: 0,
				keyword: ''
			},

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

			showQuestionAnswers: false,

			references: {}
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			terms: state => state.notes.terms,
			questions: state => state.questions.list
		}),
		noteHeader() {
			if(this.$refs.noteHeader) return this.$refs.noteHeader;
			else if (this.references.noteHeader) return this.references.noteHeader;
			return null;
      },
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
	},
	beforeDestroy(){
      window.removeEventListener(SHOW_TERM, this.onShowTerm);
   },
	methods: {
		init() {
         let title = getRouteTitle(this.$route);
			this.title = title;
			this.setActions();
		},
		setActions() {
			let types = [NOTE_CATEGORY, SEE_QUESTIONS];
			this.$store.dispatch(LOAD_ACTIONS, [types]);
		},
      fetchData({ subject, term, keyword }) {
			this.setReady(false);
			let params = {
				subject, term, keyword
			};
			this.params = params;
			this.$store.dispatch(FETCH_NOTES, params)
			.then(terms => {
				this.fetchQuestions();
				// if(this.params.keyword) {
				// 	this.$nextTick(() => {
				// 		this.setReady(true);
				// 	});
				// }else this.fetchQuestions();
				
			})
			.catch(error => {
				Bus.$emit('errors', resolveErrorData(error));
			})
		},
		setReady(val) {
			if(val) {
				this.ready = true;
				this.version += 1;
			}else {
				this.ready = false;
				this.showQuestionAnswers = false;
				this.$store.commit(SET_QUESTIONS, []);
			}
		},
		fetchQuestions() {
			let params = { term: this.params.term, subject: this.params.subject };
			this.$store.dispatch(FETCH_QUESTIONS, params)
			.then(questions => {
				this.$nextTick(() => {
					this.setReady(true);
				});
			})
			.catch(error => {
				Bus.$emit('errors', resolveErrorData(error));
			})
		},
		onActionSelected(name) {
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
		}
      
	}
}
</script>