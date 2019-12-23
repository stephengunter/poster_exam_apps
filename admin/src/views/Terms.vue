<template>
	<v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<v-layout row v-show="!subject.selecting">
						<v-flex xs12 sm6 md6>
							<a href="#" @click.prevent="selectSubject"> 科目： {{ subject.fullText }} </a>
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
							<v-treeview v-if="ready" :items="termList" item-children="subItems" item-text="fullText"
							open-all activatable hoverable  active-class="primary--text"
							:active.sync="tree.active"
							>
								<template v-slot:label="{ item }">
									<term-tree-item :item="item" :max_width="treeMaxWidth" />
								</template>
							</v-treeview>
						</v-flex>
					</v-layout>
						
				</material-card>
			</v-flex>
      </v-layout>
		<v-dialog v-model="subject.selecting" :max-width="subject.maxWidth">
			<v-card>
				<v-card-text>
					<v-container>
						<core-category-selector ref="categorySelector" title="科目"
						:all_items="subjectList" :selected_id="params.subject"
						@select-changed="onSubjectSelected"
						/>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<term-edit v-if="editor.active" :model="editor.model" :all_items="editor.allItems"
			:subjects="editor.subjects"
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

import { FETCH_SUBJECTS, FETCH_TERMS, CREATE_TERM, STORE_TERM,
EDIT_TERM, UPDATE_TERM, DELETE_TERM } from '@/store/actions.type';

import { onError } from '@/utils';

export default {
	name: 'TermsView',
	data () {
		return {
			ready: false,
			params: {
				subject: 0,
				parent: 0
			},
			subject: {
				selecting: false,
				maxWidth: 800,
				fullText: ''
			},

			editor: {
				active: false,
				maxWidth: 800,
				model: null,
				subjects: [],
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
			termList: state => state.terms.list,
		}),
		selectId() {
			if(this.tree.active.length) return this.tree.active[0];
			return 0;
		},
		treeMaxWidth() {
			return this.contentMaxWidth - 65;
		},
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		}
	},
	watch: {
      selectId: 'onSelectIdChanged'
   },
	beforeMount(){
		this.init();

		this.$store.dispatch(FETCH_SUBJECTS, { subItems: false })
		.then(subjects => {
			setTimeout(() => {
				this.$refs.categorySelector.init();
			}, 500)
		})
		.catch(error => {
			onError(error);
		})
	},
	methods: {
		init(){
			this.ready = false;
			this.editor.active = false;
			this.deletion.id = 0;
			this.deletion.active = false;
			this.setEditModel(null);
			this.clearSelect();
			
		},
		selectSubject() {
			if(this.contentMaxWidth) this.subject.maxWidth = this.contentMaxWidth;
			this.subject.selecting = true;
		},
		onSelectIdChanged() {
			let id = this.selectId;
			if(id) this.edit(id);
		},
		clearSelect() {
			this.tree.active = [];
		},
		onSubjectSelected(item){
			let id = 0;
			if(item) id = item.id;

			this.params.subject = id;

			this.fetchData();
			this.subject.fullText = this.$refs.categorySelector.getSelectedListText();
			this.subject.selecting = false;
			
		},
		fetchData(){
			this.ready = false;
			this.clearSelect();

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_TERMS, this.params)
			.then(terms => {
				this.ready = true;		
			})
			.catch(error => {
				onError(error);
			})
		},
		create(){
			this.clearSelect();

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_TERM, this.params)
			.then(model => {
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
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.subjects = this.subjectList;

				this.editor.model = model.term;
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
			let id = this.deletion.id;
			this.$store.dispatch(DELETE_TERM, id)
			.then(() => {
				this.init();
				this.fetchData();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
		cancelDelete(){
			this.deletion.active = false;
			this.deletion.id = 0;
		},
      submit(){
			let model = this.editor.model;

			this.$store.commit(CLEAR_ERROR);
			let action = model.id ? UPDATE_TERM : STORE_TERM;
         this.$store.dispatch(action, model)
			.then(() => {
				this.init();
				this.fetchData();
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


<style scoped>
br::before {
  content:"Look at this orange box.";
}
</style>