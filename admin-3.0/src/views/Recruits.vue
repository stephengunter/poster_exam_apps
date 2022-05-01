<template>
   <core-container>
      <recruit-header :params="params"
		:active_options="activeOptions" :year_options="yearOptions"
		:can_create="canCreate"
		@create="create" @params-changed="onParamsChanged"
		/>
		<v-row>
			<v-col cols="12">
				<recruit-table :list="recruitList" @edit="edit"
				:allow_drag ="table.allow_drag"
				@order-changed="onOrderChanged"
				/>
			</v-col>
		</v-row>
	   <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<recruit-edit v-if="editor.active" :model="editor.model"
			:subject_options="editor.subjectOptions" :year_options="editor.yearOptions"
			@submit="submit" @cancel="cancelEdit" @remove="remove"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import {
   FETCH_RECRUITS, CREATE_RECRUIT, STORE_RECRUIT, 
   EDIT_RECRUIT, UPDATE_RECRUIT, ORDER_RECRUITS, DELETE_RECRUIT
} from '@/store/actions.type';

import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, toRocYear } from '@/utils';

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
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
				allItems: []
			}
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			recruitList: state => state.recruits.list
		}),
		canCreate(){
			return !this.editor.active;
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
		remove() {
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {}
			});
		},
		submitDelete() {
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
		}
	}
}
</script>