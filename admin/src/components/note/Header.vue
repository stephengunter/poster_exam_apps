<template>
<div>
	<v-layout row wrap>
		<v-flex xs12>
			<core-bread :items="bread.items"
			@selected="onBreadSelected"
			/>
		</v-flex>
	</v-layout>
	<v-dialog v-model="category.active" persistent :max-width="category.maxWidth">
		<note-category :allow_cancel="params.term > 0"
		:subject_options="subjectOptions" :params="params"
		:trees="trees" 
		@subject-changed="onSubjectChanged"
		@selected="onTermSelected" @cancel="category.active = false"
		/>
	</v-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { NOTE_CATEGORY } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   name: 'NoteHeader',
   props: {
		index_model: {
			type: Object,
			default: null
		},
      init_params: {
			type: Object,
			default: null
		},
		can_create: {
			type: Boolean,
			default: false
		},
	},
   data () {
		return {
			params: {},

			rootSubjects: [],
			subjects: [],
			subject: null,
			terms: [],

			subjectOptions: [],

			trees: [],

			category: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			bread: {
            items: []
			},
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth'])
   },
   methods: {
		init() {
			this.params = { ...this.init_params };

			let model = this.index_model;
			this.rootSubjects = model.rootSubjects;
			this.subjects = model.subjects;
			this.subject = model.subject;
			this.terms = model.terms;

			this.subjectOptions = this.rootSubjects.map(item => ({
				value: item.id, text: item.title
			}));

			this.params.subject = this.subject.id;
			this.loadTrees();
			//this.setTitle();
		},
		loadTrees() {
			let trees = [];
			let subject = this.subject;
			let terms = this.terms;

			if(subject.subItems.length) {
				trees = subject.subItems.map(item => ({
					type: 'subject',
					id: item.id, subItems: [],
					title: item.title, text: item.text
				}));
			}else {
				trees.push({
					type: 'subject',
					id: subject.id, subItems: [],
					title: subject.title, text: subject.text
				});
			}

			trees.forEach(item => {
				item.subItems = terms.filter(term => term.subjectId === item.id);
			});

			this.trees = trees;

			if(!this.params.term) {
				this.showCategory();
			}
		},
		setTitle(term) {
         this.clearBread();
			this.addBreadItem(NOTE_CATEGORY, this.subject.title);
			
			this.addBreadItem(NOTE_CATEGORY, term.subject.title);

			if(term.parentId) {
				let parent = this.terms.find(item => item.id === term.parentId);
				this.addBreadItem(NOTE_CATEGORY, parent.fullText);
			}
			
			this.addBreadItem(NOTE_CATEGORY, term.fullText);
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
			this.category.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.category.active = true;
		},
		onSubjectChanged(val) {
			this.subject = this.rootSubjects.find(item => item.id === val);
			this.loadTrees();
		},
		onTermSelected(item) {
			this.params.term = item.id;
			console.log('onTermSelected', item);
			console.log('params', this.params);
			this.$emit('params-changed', this.params);

			this.setTitle(item);
			this.category.active = false;
		}
   }
}
</script>

<style>

</style>