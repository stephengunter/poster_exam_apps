<template>
   <v-dialog v-model="category.active" :max-width="category.maxWidth" :persistent="true">
      <note-category :allow_select="false"
      :allow_cancel="true" :version="category.version"
      :params="category.params" :mode_options="modeOptions"
      :subject_options="subjectOptions"
      :tree_items="tree.items"
      @cancel="onCancel"
      @root-changed="onRootSubjectChanged"
      />
   </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { NOTE_CATEGORY } from '@/store/actions.type';
import { SET_LOADING, SET_NOTE_CATEGORIES } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH,  NOTES_SETTINGS} from '@/config';
import { resolveErrorData, onError } from '@/utils';
import CategoriesService from '@/services/categories.service';

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
      ...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			categories: state => state.notes.categories,
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
		if(this.categories && this.categories.length) {
			this.init();
			return;
		}

		
      this.$store.commit(SET_LOADING, true);
      CategoriesService.fetch()
      .then(categories => {
         this.$store.commit(SET_NOTE_CATEGORIES, categories);
         this.$nextTick(() => {
            this.init();
         });
      })
      .catch(error => {
         onError(error);
      })
      .finally(() => { 
         this.$store.commit(SET_LOADING, false);
      });
   },
   methods: {
      init() {
			this.params.rootSubject = this.subjectOptions[0].value;
			this.setTreeItems(this.params.rootSubject);
			
			this.showCategory();
		},
      setTreeItems(rootSubjectId) {
         let category = this.categories.find(item => item.id === rootSubjectId);
         this.tree.items = category.subItems;
		},
		onRootSubjectChanged(val) {
			this.params.rootSubject = val;
         this.params.subject = 0;
			this.params.term = 0;
			
			this.category.params = { ...this.params };
			this.setTreeItems(val);
		},
		showCategory() {
			this.category.params = { ...this.params };
			this.category.version += 1;
			this.category.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.category.active = true;
      },
      onCancel() {
         this.category.active = false;
         this.$emit('cancel');
      }
      

   }
}
</script>