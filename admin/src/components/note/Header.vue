<template>
<div>
	<v-layout row wrap>
		<v-flex xs12 sm6>
			<core-bread :items="bread.items"
			@selected="onBreadSelected"
			/>
		</v-flex>
		<v-flex xs12 sm6 text-xs-right>
			<v-btn @click.prevent="refresh" class="mx-2" fab small>
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-flex>
	</v-layout>
	
	<v-dialog v-model="category.active" :max-width="category.maxWidth" :persistent="true">
		<note-category
		:allow_cancel="version > 0 || paramsValid" :version="category.version"
		:params="category.params" :subject_options="subjectOptions"
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
import { DIALOG_MAX_WIDTH } from '@/config';
import { FETCH_NOTE_CATEGORIES , NOTE_CATEGORY } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'NoteHeader',
   props: {
		can_create: {
			type: Boolean,
			default: false
		},
      version: {
         type: Number,
         default: 0
      }
	},
   data () {
		return {
			params: {
				rootSubject: 0,
				subject: 0,
            term: 0,
            keyword: '',
         },
         subjectOptions: [],
			subjects : [],
			terms: [],

			category: {
				params: {},
				version: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },

			bread: {
            items: []
			},

			tree: {
            items: []
			}
			
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
	beforeMount() {
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
         this.setTreeItems(this.params.rootSubject);

         this.subjectOptions = subjectOptions;
			this.showCategory();

			let subjects = this.categories.flatMap(item => item.subItems);
			let terms = subjects.flatMap(item => item.subItems);
			this.subjects = subjects;
			this.terms = terms;
		},
		setTreeItems(rootSubjectId) {
         let category = this.categories.find(item => item.id === rootSubjectId);
			this.tree.items = category.subItems;
		},
		onRootSubjectChanged(val) {
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
			this.addBreadItem(NOTE_CATEGORY, this.rootSubject.text);
			
			if(this.params.keyword) {
				if(this.subject) this.addBreadItem(NOTE_CATEGORY, this.subject.text);
				this.addBreadItem(NOTE_CATEGORY, `搜尋：${this.params.keyword}` );
			}else {
				this.addBreadItem(NOTE_CATEGORY, this.subject.text);
				if(this.term) this.addBreadItem(NOTE_CATEGORY, this.term.text);
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
			this.showCategory();
		},
		showCategory() {
			this.category.params = { ...this.params };
			this.category.version += 1;
			this.category.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.category.active = true;
		},
		refresh() {
			this.$emit('refresh');
		}
   }
}
</script>

<style>

</style>