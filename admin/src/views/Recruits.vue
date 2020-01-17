<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
			<v-flex xs12>
				<material-card>
					<recruit-header :params="params"
					:active_options="activeOptions" :year_options="yearOptions"
					:can_create="canCreate"
					@create="create" @params-changed="onParamsChanged"
					/>
					<v-layout row wrap>
						<v-flex xs12>
							<recruit-table :list="recruitList" @edit="edit"
							@edit-subItem="editSubItem"
							:allow_drag ="table.allow_drag"
							@order-changed="onOrderChanged"
							/>
						</v-flex>
					</v-layout>
				</material-card>
			</v-flex>
     </v-layout>
	  <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<recruit-edit v-if="editor.active" :model="editor.model"
			:subject_options="editor.subjectOptions" :year_options="editor.yearOptions"
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
import {
   FETCH_RECRUITS, CREATE_RECRUIT, STORE_RECRUIT, 
   EDIT_RECRUIT, UPDATE_RECRUIT, ORDER_RECRUITS, DELETE_RECRUIT
} from '@/store/actions.type';

import { toRocYear } from '@/utils';

export default {
   name: 'RecruitsView',
   data () {
		return {
			params: {
				year: 0,
				active: 1
			},
			activeOptions: [{
				value: 1,
				text: '上架中'
			},{
				value: 0,
				text: '已下架'
			}],
			yearOptions: [{ value: 0, text: '全部年度' }],

			table: {
				allow_drag: false
			},

			editor: {
				subjectOptions: [],
				yearOptions: [],
				active: false,
				maxWidth: 800,
				model: null,
				allItems: []
			},

			deletion: {
				id: 0,
				active: false,
				maxWidth: 480
			}
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			recruitList: state => state.recruits.list
		}),
		canCreate(){
			return !this.editor.active && !this.deletion.active;
		}
   },
   beforeMount(){

		let yearOptions = [];
		let thisYear = new Date().getFullYear();
		let min = thisYear - 10;
		let max = thisYear + 1;
		for(let i = max; i >= min; i--) {
			let year = toRocYear(i);
			yearOptions.push({
				value: year, text: year
			});
		}

		this.editor.yearOptions = yearOptions.slice(0);
		this.yearOptions = this.yearOptions.concat(yearOptions);

		this.init();
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
			this.table.allow_drag = !this.table.allow_drag;

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(FETCH_RECRUITS, params)
			.then(() => {
				this.table.allow_drag = params.year > 0;
			})
			.catch(error => {
				onError(error);
			})
		},
		create(){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(CREATE_RECRUIT)
			.then(model => {
				model.year = this.editor.yearOptions[0].value;
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		edit(id){
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_RECRUIT, id)
			.then(model => {
				console.log('model', model);
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setEditModel(model) {
			if(model) {
				this.editor.model = model.recruit;
				if(model.subjectOptions) this.editor.subjectOptions = model.subjectOptions;
				

				if(this.contentMaxWidth) this.editor.maxWidth = this.contentMaxWidth;
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
			if(this.contentMaxWidth) {
				if(this.responsive)  this.deletion.maxWidth = this.contentMaxWidth; 
				else this.deletion.maxWidth = this.contentMaxWidth * 0.6;
			}
			this.deletion.id = this.editor.model.id;
			this.deletion.active = true;
		},
		submitDelete(){
			let id = this.editor.model.id;

			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(DELETE_RECRUIT, id)
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
			let action = model.id ? UPDATE_RECRUIT : STORE_RECRUIT;
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

			if(!this.table.allow_drag) return;
			if(oldIndex === newIndex) return;

			let up = oldIndex > newIndex;

			let targetId = this.recruitList[oldIndex].id;
			let replaceId = this.recruitList[newIndex].id;

			this.$store.dispatch(ORDER_RECRUITS, { targetId, replaceId, up })
			.then(() => {
				this.init();
				Bus.$emit('success');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
		},
		editSubItem(id) {
			alert(id);
		}
	}
}
</script>

<style>

</style>