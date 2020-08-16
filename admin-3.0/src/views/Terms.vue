<template>
	<core-container>
		<subject-selector ref="subjectSelector" title="科目"
		:subject_list="subjectList"
		@selected="onSubjectSelected"
		>
			<v-col cols="12" sm="6" md="6" class="text-right">
				<core-button-create tooltip="新增" :disabled="!canCreate"
				@create="create"
				/>
			</v-col>
		</subject-selector>
		<v-row>
			<v-col cols="12">
				<term-tree :show_status="true"
				:items="termList" :version="tree.version"
				:selected_id="tree.selectedId"
				@selected="onSelected"
				/>
			</v-col>
		</v-row>
		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<term-edit v-if="editor.active" :model="editor.model"
			:subject_list="subjectList"
			@saved="onSaved" @cancel="cancelEdit"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SET_TERMS, CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_SUBJECTS, FETCH_TERMS, CREATE_TERM, STORE_TERM,
EDIT_TERM, UPDATE_TERM, DELETE_TERM
} from '@/store/actions.type';
import { onError, toCnNumber, findSubject, deepClone } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'TermsView',
	data () {
		return {
			params: {
				subject: 0,
				parent: 0
			},

			tree: {
				version: 0,
				selectedId: 0
			},

			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
				lastModel: null
			},

			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
      ...mapState({
			subjectList: state => state.subjects.list,
			termList: state => state.terms.list,
		}),
		canCreate(){
			return !this.editor.active;
		},
		subjectSelector() {
			if(this.$refs.subjectSelector) return this.$refs.subjectSelector;
			else if (this.references.subjectSelector) return this.references.subjectSelector;
			return null;
		}
	},
	beforeMount() {
		this.$store.dispatch(FETCH_SUBJECTS)
		.then(() => {
			this.$nextTick(() => {
				this.subjectSelector.init(this.params.subject);
				let subject = this.subjectSelector.category.models[0].items[0];

				if(subject.subItems && subject.subItems.length) this.onSubjectSelected(subject.subItems[0].id);
				else this.onSubjectSelected(subject.id);
			})
		})
		.catch(error => {
			onError(error);
		})
	},
	methods: {
		onSubjectSelected(id) {
			if(!id) return;
			if(id === this.params.subject) return;

			this.params.subject = id;

			this.subjectSelector.setSubject(id);
			this.subjectSelector.cancelSelect();

			this.fetchData();
		},
		onSelectIdChanged() {
			let id = this.selectId;
			if(id) this.edit(id);
		},
		fetchData() {
			this.clearSelect();

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_TERMS, this.params)
			.then(terms => {
				this.$store.commit(SET_TERMS, terms);
				this.$nextTick(() => {
					this.tree.version += 1;
				});	
			})
			.catch(error => {
				onError(error);
			})
		},
		onSelected(id) {
			this.tree.selectedId = id;
			if(id) this.edit(id);
		},
		clearSelect() {
			this.tree.selectedId = 0;
		},
		create() {
			let subject = this.editor.lastModel ? this.editor.lastModel.subjectId : this.params.subject;
			let parent = this.editor.lastModel ? this.editor.lastModel.parentId : 0;

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_TERM, { subject, parent })
			.then(model => {
				let cnOrder = toCnNumber(model.order);
				if(cnOrder) model.title = `第${cnOrder}條`;
				
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_TERM, id)
			.then(model => {
				if(model.highlights) model.highlight = model.highlights.join('\n');				
				else model.highlights = [];

				if(model.references && model.references.length) {
					model.reference = model.references.map(item => `${item.text},${item.id},${item.type}`).join('\n');
				}else model.reference = '';
				
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
			this.clearSelect();
		},
      cancelEdit() {
			this.setEditModel(null);
		},
		onSaved() {
			this.editor.lastModel = deepClone(this.editor.model);

			Bus.$emit('success');
			this.fetchData();
			this.setEditModel(null);
		}
	}
}
</script>