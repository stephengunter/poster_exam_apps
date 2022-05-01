<template>
   <core-container>
		<v-row>
			<v-col cols="12" sm="6">
				<v-select label="Type"
				:items="typeOptions" v-model="params.type"
				@change="onTypeChanged"
				/>
			</v-col>
			<v-col cols="12" sm="6">
				<v-text-field v-model="dateSelector.text" label="日期" clearable
				@click.prevent="selectDate" @click:clear="clearDate"
				/>
			</v-col>
		</v-row>
		<v-row v-if="pagedList">
         <v-col cols="12">
            <exception-table :list="dataList"
				@selected="onDetails"
				/>
         </v-col>
      </v-row>

		<core-table-pager v-if="pagedList" v-show="dataList.length > 0"
		list_key="list"
		:model="pagedList" :responsive="responsive"
		@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
		/>

		<v-dialog v-model="dateSelector.active" :max-width="dateSelector.maxWidth" persistent>
			<core-period-selector
			:version="dateSelector.version" :period="period"
			:start="dateSelector.start" :end="dateSelector.end"
			@submit="onDateSelected" @cancel="dateSelector.active = false"
			/>
		</v-dialog>
	   
		<v-dialog v-model="details.active" persistent :max-width="details.maxWidth">
			<exception-details v-if="details.model" :model="details.model"
			@cancel="cancelDetails"
			/>
		</v-dialog>

	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_EXCEPTIONS } from '@/store/actions.type';
import { onError, scrollToTop } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'ExceptionsView',
   data () {
		return {
			
			params: {
				type: '',
				start: '',
				end: '',
				page: -1,
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
			details: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
			},
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			pagedList: state => state.exceptions.pagedList,
			typeOptions: state => state.exceptions.typeOptions,
			period: state => state.exceptions.period
		}),
		dataList() {
			if(this.pagedList) {
				return this.pagedList.list;
			} return [];
		},
		firstLoad() {
			return this.params.page < 0;
		}
   },
   beforeMount(){
		this.fetchData();
	},
   methods: {
		onTypeChanged(val) {
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
			this.$store.dispatch(FETCH_EXCEPTIONS, this.params)
			.then(() => {
				if(this.firstLoad) this.params.page = 1;
			})
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
			this.onDateSelected({ start: '', end: ''});
		},
		onDetails(id) {
			let model = this.dataList.find(item => item.id === id);
			this.setDetailsModel(model);
		},
		cancelDetails() {
			this.setDetailsModel(null);
		},
		setDetailsModel(model) {
			if(model) {
				this.details.model = model;
				if(this.contentMaxWidth) this.details.maxWidth = this.contentMaxWidth;
				this.details.active = true;
			}else {
				this.details.model = null;
				this.details.active = false;
			}
		},
		
	}
}
</script>