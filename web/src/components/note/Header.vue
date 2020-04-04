<template>
   <div class="mb-2">
      <core-bread :items="bread.items"
      @selected="onBreadSelected"
      />
      
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
import { DIALOG_MAX_WIDTH,  NOTES_SETTINGS} from '@/config';
import { resolveErrorData } from '@/utils';

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
         subjectOptions: [],
			subjects : [],
			terms: [],

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
			},

			bread: {
            items: []
			},
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			categories: state => state.notes.categories
		}),
		rootSubject() {
			if(this.params.rootSubject) return this.categories.find(item => item.id === this.params.rootSubject);
			return null;
		},
		subject() {
			if(this.params.subject) {
				return this.subjects.find(item => item.id === this.params.subject);
			}else if(this.term){
				return this.subjects.find(item => item.id === this.term.parentId);
			}
			return null;
		},
		term() {
			if(this.params.term) {
				return this.terms.find(item => item.id === this.params.term);
			}
			return null;
		},
		paramsValid() {
         return this.params.subject > 0 || this.params.term > 0
      }
	},
   beforeMount(){
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
         let subjectOptions = this.categories.map(item => ({ value: item.id, text: item.text }));
			this.params.rootSubject = subjectOptions[0].value;
			this.loadModeOptions(this.params.rootSubject);

         this.setTreeItems(this.params.rootSubject);

         this.subjectOptions = subjectOptions;
			this.showCategory();

			let subjects = this.categories.flatMap(item => item.subItems);
			let terms = subjects.flatMap(item => item.subItems);
			this.subjects = subjects;
			this.terms = terms;
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
		
			this.params = { ...params };
			this.$emit('params-changed', params);
			
			this.$nextTick(() => {
				this.setTitle();
				this.category.active = false;
			});
		},
		setTitle() {
			
			this.clearBread();
			this.addBreadItem(NOTE_CATEGORY, this.title);
			this.addBreadItem(NOTE_CATEGORY, this.rootSubject.text);
			
			if(this.params.keyword) {
				if(this.subject) this.addBreadItem(NOTE_CATEGORY, this.subject.text);
				this.addBreadItem(NOTE_CATEGORY, `搜尋：${this.params.keyword}` );
			}else {
				
				this.addBreadItem(NOTE_CATEGORY, this.subject.text);
				if(this.term) this.addBreadItem(NOTE_CATEGORY, this.term.text);

				let mode = this.modeOptions.find(item => item.value === this.params.mode);
				if(mode)this.addBreadItem(NOTE_CATEGORY, mode.text);
			}
			
      },
		clearBread() {
         this.bread.items = [];
      },
      addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
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