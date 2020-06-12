<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<manual-header ref="manualHeader" :params="params"
					:active_options="activeOptions"
					:can_create="canCreate"
					@create="create" @params-changed="onParamsChanged"
					/>
					<v-layout row wrap>
						<v-flex xs12>
							<manual-table :list="list" @edit="edit"
							@select="onSelected"
							@edit-subItem="editSubItem" @add-subItem="addSubItem"
							@edit-feature="editFeature" @add-feature="addFeature"
							@order-changed="onOrderChanged"
							/>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
      </v-layout>
	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<manual-edit v-if="editor.active" :model="editor.model" :parent_options="parentOptions"
			@submit="submit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
		<v-dialog v-model="selection.active" persistent :max-width="selection.maxWidth">
			<v-card>
				<core-close-icon-button @close="setSelectionItem(null)" />
				<manual-table :list="selection.list" @edit="edit"
				@edit-subItem="editSubItem" @add-subItem="addSubItem"
				@edit-feature="editFeature" @add-feature="addFeature"
				@order-changed="onOrderChanged"
				/>
			</v-card>
		</v-dialog>
		<v-dialog v-model="featureEditor.active" persistent :max-width="featureEditor.maxWidth">
			<feature-edit v-if="featureEditor.active" :manual="featureEditor.manual" :id="featureEditor.id"
			@saved="onFeatureSaved" @cancel="cancelEditFeature"
			/>
		</v-dialog>
		<v-dialog v-model="deletion.active" :max-width="deletion.maxWidth">
			<core-confirm @ok="submitDelete" @cancel="cancelDelete" />
		</v-dialog>
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import {
   FETCH_MANUALS, CREATE_MANUAL, STORE_MANUAL, 
   EDIT_MANUAL, UPDATE_MANUAL, ORDER_MANUALS, DELETE_MANUAL
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

			table: {
				allow_drag: false
			},

			editor: {
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

			featureEditor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				manual: null,
				id: 0
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			references: {}
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			list: state => state.manuals.list
		}),
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		},
		manualHeader() {
			if(this.$refs.manualHeader) return this.$refs.manualHeader;
			else if (this.references.manualHeader) return this.references.manualHeader;
			return null;
      }
   },
   beforeMount(){
		this.init();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		init(){
			this.editor.active = false;
			this.deletion.active = false;
			this.setEditModel(null);

			this.fetchData(this.params);
		},
		onParamsChanged() {
			this.fetchData(this.params);
		},
		fetchData(params){
			if(!params) params = this.params;

			this.setEditModel(null);
			this.setSelectionItem(null);

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_MANUALS, params)
			.then(() => {
				
			})
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
		create(parent = null){
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
		remove(){
			this.deletion.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.deletion.id = this.editor.model.id;
			this.deletion.active = true;
		},
		submitDelete(){
			let id = this.editor.model.id;

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(DELETE_MANUAL, id)
			.then(() => {
				this.init();
			})
			.catch(error => {
				onError(error);
			})
		},
		cancelDelete(){
			this.deletion.active = false;
			this.deletion.id = 0;
		},
      submit(){
			let model = this.editor.model;

			this.$store.commit(CLEAR_ERROR);
			let action = model.id ? UPDATE_MANUAL : STORE_MANUAL;
         this.$store.dispatch(action, model)
			.then(() => {
				this.init();
				Bus.$emit('success');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		//處理Sortable onDragEnd事件
		onOrderChanged({ oldIndex, newIndex }) {
			
			if(oldIndex === newIndex) return;

			let up = oldIndex > newIndex;

			let targetId = this.recruitList[oldIndex].id;
			let replaceId = this.recruitList[newIndex].id;

			this.$store.dispatch(ORDER_MANUALS, { targetId, replaceId, up })
			.then(() => {
				this.init();
				Bus.$emit('success');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		addSubItem(parent) {
			this.create(parent);
		},
		editSubItem(id) {
			console.log('editSubItem',id);
		},
		addFeature(manual) {
			this.setFeatureEditor(manual);
		},
		setFeatureEditor(manual = null, id = 0) {
			if(manual) {
				this.featureEditor.manual = manual;
				this.featureEditor.id = id;
				this.featureEditor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.featureEditor.active = true;
			}else {
				this.featureEditor.manual = null;
				this.featureEditor.id = 0;
				this.featureEditor.active = false;
			}
		},
		cancelEditFeature() {
			this.setFeatureEditor(null);
		},
		editFeature({ manual, feature }) {
			this.setFeatureEditor(manual, feature.id);
		},
		onFeatureSaved() {
			this.cancelEditFeature();
			this.fetchData();
		}
	}
}
</script>

<style>

</style>