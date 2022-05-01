<template>
	<core-container>
		<v-row row>
			<v-col cols="12" class="text-right">
				<core-button-create tooltip="新增" :disabled="!canCreate"
				@create="create"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<subject-tree v-if="treeItems.length" :show_status="true"
				:items="treeItems" :version="tree.version"
				:selected_id="tree.selectedId"
				@selected="onSelected"
				/>
			</v-col>
		</v-row>
	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<subject-edit v-if="editor.active"
			:model="editor.model" :all_items="subjectList"
			@saved="onSaved" @cancel="cancelEdit"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Category  from '@/models/category';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_SUBJECTS, CREATE_SUBJECT, EDIT_SUBJECT } from '@/store/actions.type';
import { onError } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'SubjectsView',
	data () {
		return {
			category: null,

			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
			},

			tree: {
				version: 0,
				selectedId: 0
			}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
      ...mapState({
			subjectList: state => state.subjects.list,
		}),
		treeItems() {
			if(this.category) {
				return this.category.models.length ? this.category.models[0].items : [];
			}
			return [];
		},
		canCreate() {
			return !this.editor.active;
		}	
	},
	watch: {
      selectId: 'onSelectIdChanged'
   },
	beforeMount() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_SUBJECTS)
			.then(() => {
				this.$nextTick(() => {
					this.category = new Category(this.subjectList, 0);
				})
			})
			.catch(error => {
				onError(error);
			})
		},
		onSelected(id) {
			if(id) {
				this.tree.selectedId = id;
				this.edit(id);
			} 
		},
		create() {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_SUBJECT)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_SUBJECT, id)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
			.finally(() => {
				this.tree.selectedId = 0;
			});
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
		},
      cancelEdit() {
			this.setEditModel(null);
		},
		onSaved(model) {
			Bus.$emit('success');

			this.fetchData();
			this.setEditModel(null);
		}
	}
}
</script>