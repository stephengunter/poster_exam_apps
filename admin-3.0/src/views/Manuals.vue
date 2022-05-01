<template>
   <core-container>
		<manual-header :params="params"
		:active_options="activeOptions"
		:can_create="canCreate"
		@create="create" @params-changed="onParamsChanged"
		/>
		<v-row>
			<v-col cols="12">
				<manual-table :list="list" @edit="edit"
				@select="onSelected"
				@add-subItem="addSubItem"
				@edit-feature="editFeature" @add-feature="addFeature"
				/>
			</v-col>
		</v-row>

		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<manual-edit v-if="editor.active" :model="editor.model" :parent_options="parentOptions"
			@saved="onSaved" @cancel="cancelEdit"
			/>
		</v-dialog>

		<v-dialog v-model="featureEditor.active" persistent :max-width="featureEditor.maxWidth">
			<feature-edit v-if="featureEditor.active" :model="featureEditor.model"
			@saved="onFeatureSaved" @cancel="cancelEditFeature"
			/>
		</v-dialog>

		<v-dialog v-model="selection.active" persistent :max-width="selection.maxWidth">
			<v-card>
				<v-card-title>
					<v-spacer />
					<v-btn @click.prevent="setSelectionItem(null)" icon>
						<v-icon>mdi-window-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<manual-table :list="selection.list" @edit="edit"
					@add-subItem="addSubItem"
					@edit-feature="editFeature" @add-feature="addFeature"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_MANUALS, CREATE_MANUAL, EDIT_MANUAL, 
	CREATE_FEATURE, EDIT_FEATURE
} from '@/store/actions.type';

import { onError } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'ManualsView',
   data () {
		return {
			params: {
				active: 1
			},
			activeOptions: [{
				value: 1,
				text: '上架中'
			},{
				value: 0,
				text: '已下架'
			}],

			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
			},

			featureEditor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
			},

			selection: {
				list: [],
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			parentOptions: [],

			references: {}
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			list: state => state.manuals.list
		}),
		canCreate(){
			return !this.editor.active;
		}
   },
   beforeMount(){
		this.fetchData();
	},
   methods: {
		init(){
			this.editor.active = false;
			this.deletion.active = false;
			this.setEditModel(null);

			this.fetchData();
		},
		onParamsChanged() {
			this.fetchData();
		},
		fetchData() {
			this.setEditModel(null);
			this.setSelectionItem(null);

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_MANUALS, this.params)
			.catch(error => {
				onError(error);
			})
		},
		setParentOptions(options) {
			options.unshift({ value: 0, text: '-----'})
			this.parentOptions = options;
		},
		onSelected(item) {
			this.setSelectionItem(item);
		},
		setSelectionItem(item) {
			if(item) {
				this.selection.list = [item];
				this.selection.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.selection.active = true;
			}else {
				this.selection.list = [];
				this.selection.active = false;
			}
		},
		create(parent = null) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_MANUAL)
			.then(model => {
				this.setParentOptions(model.parents);

				let manual = model.manual;
				if(parent) manual.parentId = parent.id;

				this.setEditModel(manual);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_MANUAL, id)
			.then(model => {
				this.setParentOptions(model.parents);
				this.setEditModel(model.manual);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.setSelectionItem(null);

				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.setEditModel(null);
		},
		onSaved() {
			Bus.$emit('success');
			this.fetchData();
			this.setEditModel(null);
		},
		addSubItem(parent) {
			this.create(parent);
		},
		addFeature(manual) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_FEATURE)
			.then(model => {
				model.manualId = manual.id;
				this.setFeatureEditor(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		editFeature(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_FEATURE, id)
			.then(model => {
				this.setFeatureEditor(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setFeatureEditor(model) {
			if(model) {
				this.featureEditor.model = model;
				this.featureEditor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.featureEditor.active = true;
			}else {
				this.featureEditor.model = null;
				this.featureEditor.active = false;
			}
		},
		cancelEditFeature() {
			this.setFeatureEditor(null);
		},
		onFeatureSaved() {
			Bus.$emit('success');
			this.fetchData();
			this.setFeatureEditor(null);
		}
	}
}
</script>

<style>

</style>