<template>
	<v-container fluid grid-list-xl fill-height>
     <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row>
						<v-flex xs12 sm6 md6>
							
						</v-flex>
						<v-flex xs12 sm6 md6 text-xs-right>
							<v-tooltip top content-class="top">
								<v-btn :disabled="!canCreate" @click.prevent="create" class="mx-2" fab small color="info" slot="activator">
									<v-icon>mdi-plus</v-icon>
								</v-btn>
								<span>新增</span>
							</v-tooltip>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs12>
							<v-treeview v-if="ready" :items="subjectList" item-children="subItems" item-text="title"
							open-all activatable hoverable  active-class="primary--text"
							:active.sync="tree.active"
							>
							</v-treeview>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	  <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<subject-edit v-if="editor.active" :model="editor.model" :all_items="editor.allItems"
			@submit="submit" @cancel="cancelEdit" @remove="remove"
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

import { FETCH_SUBJECTS, CREATE_SUBJECT, STORE_SUBJECT,
EDIT_SUBJECT, UPDATE_SUBJECT, DELETE_SUBJECT } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'SubjectsView',
	data () {
		return {
			ready: false,
			params: {
				
			},

			editor: {
				active: false,
				maxWidth: 800,
				model: null,
				allItems: []
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: 480
			},

			tree: {
				active: []
			}
			
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
      ...mapState({
			subjectList: state => state.subjects.list,
		}),
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		},
		selectId() {
			if(this.tree.active.length) return this.tree.active[0];
			return 0;
		}
		
	},
	watch: {
      selectId: 'onSelectIdChanged'
   },
	beforeMount(){
		this.init();
	},
	methods: {
		init(){
			this.ready = false;
			this.editor.active = false;
			this.deletion.active = false;
			this.setEditModel(null);
			this.clearSelect();

			this.fetchData();
		},
		fetchData(){
			this.ready = false;
			this.clearSelect();

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_SUBJECTS, this.params)
			.then(subjects => {
				this.ready = true;
			})
			.catch(error => {
				onError(error);
			})
		},
		onSelectIdChanged() {
			let id = this.selectId;
			if(id) {
				this.edit(id);
			}
		},
		clearSelect() {
			this.tree.active = [];
		},
		search(){
			this.fetchData();
		},
		create(){
			this.clearSelect();
			
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_SUBJECT)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_SUBJECT, id)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model.subject;
				this.editor.allItems = model.parents;
				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.allItems = [];
				this.editor.active = false;
			}
		},
      cancelEdit(){
			this.clearSelect();
			this.setEditModel(null);
		},
		remove(){
			if(this.contentMaxWidth) {
				if(this.responsive)  this.deletion.maxWidth = this.contentMaxWidth; 
				else this.deletion.maxWidth = this.contentMaxWidth * 0.6;
			}
			this.deletion.id = this.editor.model.id;
			this.deletion.active = true;
		},
		submitDelete(){
			this.$store.commit(CLEAR_ERROR);
			let id = this.editor.model.id;
			this.$store.dispatch(DELETE_SUBJECT, id)
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
			let action = model.id ? UPDATE_SUBJECT : STORE_SUBJECT;
         this.$store.dispatch(action, model)
			.then(() => {
				this.init();
				Bus.$emit('success');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		}
	}
}
</script>