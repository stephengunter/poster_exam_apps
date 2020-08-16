<template>
   <core-container>
      <v-row>
         <v-col cols="12" sm="6">
            <v-radio-group v-model="params.status" @change="onStatusChanged" row>
               <v-radio v-for="(item, index) in statusOptions" :key="index"
               :label="item.text" :value="item.value"					
               />
            </v-radio-group>
         </v-col>
         <v-col cols="12" sm="6">
            <v-text-field v-model="dateSelector.text" label="日期" clearable readonly
				@click.prevent="selectDate" @click:clear="clearDate"
            />
         </v-col>
      </v-row>
      <v-row v-if="pagedList">
         <v-col cols="12">
            <message-table :list="dataList"
				@edit="onEdit"
				/>
         </v-col>
      </v-row>
		<core-table-pager v-if="pagedList" v-show="dataList.length > 0"
		:model="pagedList" :responsive="responsive"
		@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
		/>
		<v-dialog v-model="dateSelector.active" :max-width="dateSelector.maxWidth" persistent>
			<core-period-selector
			:version="dateSelector.version"
			:start="dateSelector.start" :end="dateSelector.end"
			@submit="onDateSelected" @cancel="dateSelector.active = false"
			/>
		</v-dialog>

		<v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<div v-if="editor.model">
				<message-details v-if="editor.model.returned" :model="editor.model"
				@cancel="cancelEdit"
				/>
				<message-edit v-else :model="editor.model"
				@saved="onSaved" @cancel="cancelEdit"
				/>
			</div>
		</v-dialog>
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { FETCH_MESSAGES, EDIT_MESSAGE } from '@/store/actions.type';
import { onError, scrollToTop } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'MessagesView',
   data () {
		return {
			
			params: {
				status: 0,
				start: '',
				end: '',
				page: 1,
				pageSize: 10
         },
         dateSelector: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				version: 0,
            start: '',
				end: '',
            text: ''
         },
			statusOptions: [{
				value: 0,
				text: '未回覆'
			},{
				value: 1,
				text: '已回覆'
			}],
			
			editor: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
			}
			
		}
	},
	computed: {
		...mapGetters(['responsive', 'contentMaxWidth']),
		...mapState({
			pagedList: state => state.messages.pagedList
		}),
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
		}  
	},
   beforeMount() {
		this.fetchData();
	},
   methods: {
		onStatusChanged(val) {
			this.fetchData();
		},
      onPageChanged(page) {
			this.params.page = page;
			this.fetchData();
		},
		onPageSizeChanged(size) {
			this.params.pageSize = size;
			this.params.page = 1;
			this.fetchData();
		},
		fetchData(){
			this.$store.dispatch(FETCH_MESSAGES, this.params)
			.catch(error => {
				onError(error);
			});

			scrollToTop();
		},
      selectDate() {
			this.dateSelector.start = this.params.start;
			this.dateSelector.end = this.params.end;
			this.dateSelector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.dateSelector.version += 1;
			this.dateSelector.active = true;
		},
		onDateSelected({ start, end }) {
			this.params.start = start;
			this.params.end = end;

			this.dateSelector.active = false;
			this.dateSelector.text = '';
			if(start) this.dateSelector.text = `${start} 起`;
			if(end) this.dateSelector.text += ` ${end} 止`;

			this.fetchData();
		},
		clearDate() {
			this.onDateSelected({ start: '', end: '' });
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
		onEdit(id) {
			this.$store.commit(CLEAR_ERROR);
			this.$store.dispatch(EDIT_MESSAGE, id)
			.then(model => {
				this.setEditModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		cancelEdit() {
			this.setEditModel(null);
		},
		onSaved() {
			Bus.$emit('success');
			this.fetchData();
			this.setEditModel(null);
		}
   }
}
</script>

<style>

</style>