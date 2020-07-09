<template>
   <div class="mb-2">
      <core-bread @selected="onBreadSelected" />
      
      <v-dialog v-model="category.active" :max-width="category.maxWidth" :persistent="true">
			<note-category
			:allow_cancel="version > 0 || paramsValid" :version="category.version"
         :params="category.params" :mode_options="modeOptions"
			:subject_options="subjectOptions"
			:tree_items="tree.items"
			@cancel="category.active = false;"
			@root-changed="onRootSubjectChanged"
         @submit="onParamsChanged"
         />
      </v-dialog>
   </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_NOTE_CATEGORIES, NOTE_CATEGORY, ACTION_SELECTED } from '@/store/actions.type';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH,  NOTES_SETTINGS} from '@/config';
import { resolveErrorData, tryParseInt } from '@/utils';

export default {
	name: 'NoteHeader',
	props: {
		title: {
			type: String,
			default: ''
		},
      version: {
         type: Number,
         default: 0
      }
   },
   data() {
		return {
         params: {
				mode: 0,
				rootSubject: 0,
				subject: 0,
            term: 0,
            keyword: '',
			},
			modeOptions: [],

			noteSelector: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
			},

			category: {
				params: {},
				version: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },
         
         tree: {
            items: []
			}
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth', 'currentUser']),
		...mapState({
			categories: state => state.notes.categories,
			userParams: state => state.notes.params,
			allSubjects: state => state.notes.allSubjects,
			subjectOptions: state => state.notes.subjectOptions,
			allTerms: state => state.notes.allTerms
		}),
		rootSubject() {
			if(this.params.rootSubject) return this.categories.find(item => item.id === this.params.rootSubject);
			return null;
		},
		subject() {
			if(this.params.subject) {
				return this.allSubjects.find(item => item.id === this.params.subject);
			}else if(this.term){
				return this.allSubjects.find(item => item.id === this.term.parentId);
			}
			return null;
		},
		term() {
			if(this.params.term) {
				return this.allTerms.find(item => item.id === this.params.term);
			}
			return null;
		},
		paramsValid() {
         return this.params.subject > 0 || this.params.term > 0
      }
	},
   beforeMount() {
		
		if(this.userParams && this.categories.length) {
			this.init();
			return;
		}
		
      this.$store.dispatch(FETCH_NOTE_CATEGORIES)
      .then(() => {
         this.$nextTick(() => {
            this.init();
         });
      })
      .catch(error => {
         Bus.$emit('errors', resolveErrorData(error));
      })
   },
   methods: {
      init() {
			
			if(this.userParams) {
				this.params.mode = tryParseInt(this.userParams.mode);
				this.params.subject = tryParseInt(this.userParams.subjectId);
				this.params.term = tryParseInt(this.userParams.termId);
			}

			if(this.params.term) {
				let term = this.allTerms.find(x => x.id === this.params.term);
				if(term) {
					let subject = this.allSubjects.find(x => x.id === term.parentId);
					if(subject) {
						this.params.subject = subject.id;
						this.params.rootSubject = subject.parentId;
					} 
					else {
						this.params.term = 0;
						this.params.subject = 0;
						this.params.rootSubject = 0;
					}
				}
				else this.params.term = 0;

			}else if(this.params.subject) {
				let subject = this.allSubjects.find(x => x.id === this.params.subject);

				if(subject) {
					this.params.subject = subject.id;
					this.params.rootSubject = subject.parentId;
				} 
				else {
					this.params.term = 0;
					this.params.subject = 0;
					this.params.rootSubject = 0;
				}
			}


			if(!this.params.rootSubject) this.params.rootSubject = this.subjectOptions[0].value;
			
			this.loadModeOptions(this.params.rootSubject);

			this.setTreeItems(this.params.rootSubject);

			this.showCategory();
		},
		loadModeOptions(subjectId) {
			let rootSubject = NOTES_SETTINGS.subjects.find(item => item.id === subjectId);
			if(rootSubject) this.modeOptions = rootSubject.modes;
			else this.modeOptions = [];

			if(!this.modeOptions.length) this.params.mode = 0;
		},
      setTreeItems(rootSubjectId) {
         let category = this.categories.find(item => item.id === rootSubjectId);
			this.tree.items = category.subItems;
		},
		onRootSubjectChanged(val) {
			this.params.rootSubject = val;
         this.params.subject = 0;
			this.params.term = 0;
			this.loadModeOptions(val);
			this.category.params = { ...this.params };
			this.setTreeItems(val);
		},
		onParamsChanged(params) {
			if(params) this.params = { ...params };
			
			this.$emit('params-changed', this.params);
			
			this.$nextTick(() => {
				this.setTitle();
				this.category.active = false;
			});
		},
		setTitle() {
			let items = [{
            action: NOTE_CATEGORY, text: this.title
         },{
				action: NOTE_CATEGORY, text: this.rootSubject.text
			}];
			
			if(this.params.keyword) {
				if(this.subject) items.push({ action: NOTE_CATEGORY, text: this.subject.text });
				items.push({ action: NOTE_CATEGORY, text: `搜尋：${this.params.keyword}` });
			}else {
				
				items.push({ action: NOTE_CATEGORY, text: this.subject.text });
				if(this.term) items.push({ action: NOTE_CATEGORY, text: this.term.text });

				let mode = this.modeOptions.find(item => item.value === this.params.mode);
				if(mode) items.push({ action: NOTE_CATEGORY, text: mode.text });
			}

			this.$store.commit(SET_BREAD_ITEMS, items);
			
      },
		onBreadSelected(item) {
			Bus.$emit(ACTION_SELECTED, item.action);
		},
		showCategory() {
			this.category.params = { ...this.params };
			this.category.version += 1;
			this.category.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.category.active = true;
		}
      

   }
}
</script>