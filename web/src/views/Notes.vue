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
import { LOAD_ACTIONS, FETCH_NOTES, NOTE_CATEGORY,
SHOW_TERM, TERM_DETAILS, ACTION_SELECTED
} from '@/store/actions.type';
import { resolveErrorData, getRouteTitle } from '@/utils';
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
			let types = [NOTE_CATEGORY];
			this.$store.dispatch(LOAD_ACTIONS, [types]);
		},
      fetchData({ subject, term, keyword }) {
			this.ready = false;
			this.params = {
				subject, term, keyword
			};
			this.$store.dispatch(FETCH_NOTES, { subject, term, keyword })
			.then(terms => {
				this.$nextTick(() => {
					this.ready = true;
					this.version += 1;
				});
			})
			.catch(error => {
				Bus.$emit('errors', resolveErrorData(error));
			})
		},
		onActionSelected(name) {
         if(name === NOTE_CATEGORY) this.noteHeader.showCategory();
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