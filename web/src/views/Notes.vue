<template>
   <v-container>
      <note-header ref="noteHeader"
		:version="version" :title="title"
      @params-changed="fetchData" @refresh="refresh"
      />

      <div v-if="ready">
			<note-list v-for="(term, index) in terms" :key="index"
				:term="term" :max_width="contentMaxWidth - 65"
			/>
		</div>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_NOTES, NOTE_CATEGORY, ACTION_SELECTED } from '@/store/actions.type';
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
	},
	methods: {
		init() {
         let title = getRouteTitle(this.$route);
         this.title = title;
      },
      fetchData({ subject, term, keyword }) {
			this.ready = false;
			this.params = {
				subject, term, keyword
			};
			this.$store.dispatch(FETCH_NOTES, { subject, term, keyword })
			.then(terms => {
				console.log(terms);
				this.$nextTick(() => {
					this.ready = true;
					this.version += 1;
				});
			})
			.catch(error => {
				Bus.$emit('errors', resolveErrorData(error));
			})
		},
		refresh() {
			this.fetchData(this.params);
		},
		onActionSelected(name) {
         if(name === NOTE_CATEGORY) {
            this.noteHeader.showCategory();            
         }
      },
		onShowPhoto(photo) {
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
		},
		onShowTerm(e) {
			let id = e.detail.id;
			let term = this.terms.find(item => item.id === Number(id));
			if(term) {
				this.showTerm.model = term;
				this.showTerm.active = true;
			}else {
				this.$store.dispatch(TERM_DETAILS, id)
				.then(model => {
					this.showTerm.model = model;
					this.showTerm.active = true;
				})
				.catch(error => {
					onError(error);
				})
			}
			
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