<template>
<div>
	<v-layout row wrap>
		<v-flex xs6>
			<v-text-field label="Type" readonly single-line hide-details
			:value="params.type"
			@click.prevent="showFilter">
				<template v-slot:prepend>
					<v-icon>mdi-filter</v-icon>
				</template>
				<template v-slot:append>
					<a href="#" v-show="params.type" @click.prevent="clearFilter">
						<v-icon>mdi-close</v-icon>
					</a>
				</template>
			</v-text-field>
		</v-flex>
		<v-flex xs6 text-xs-right>
			<v-btn @click.prevent="onSubmit" class="mx-2" fab small>
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-flex>
		<v-flex xs6>
			<v-menu full-width max-width="290"
			v-model="startDate.active"
			:close-on-content-click="false"
			>
				<template v-slot:activator="{ on }">
					<v-text-field clearable label="開始日期" readonly
					:value="params.start" v-on="on"
					name="startDateText"
					@click:clear="onStartDateClear"
					/>
				</template>
				<v-date-picker locale="zh-cn"
					v-model="params.start"
					@input="onStartDateChanged" 
				/>
			</v-menu>
		</v-flex>
		<v-flex xs6>
			<v-menu full-width max-width="290"
			v-model="endDate.active"
			:close-on-content-click="false"
			>
				<template v-slot:activator="{ on }">
					<v-text-field clearable label="結束日期" readonly
					:value="params.end" v-on="on"
					:error-messages="getErrMsg('endDateText')"
					name="endDateText"
					@click:clear="onEndDateClear"
					/>
				</template>
				<v-date-picker locale="zh-cn"
					v-model="params.end"
					@input="onEndDateChanged" 
				/>
			</v-menu>
		</v-flex>
	</v-layout>
	
	<v-dialog v-model="filter.active" :max-width="filter.maxWidth">
		<v-card>
			<v-card-text>
				<v-layout row wrap>
					<v-flex xs12>
						<v-select label="Type"
							:items="type_options" v-model="filter.type"
							@change="onFilterTypeChanged"
						/>		
					</v-flex>
				</v-layout>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError } from '@/utils';

export default {
   name: 'ExceptionHeader',
   props: {
		params: {
			type: Object,
			default: null
		},
		type_options: {
			type: Array,
			default: null
		}
	},
   data () {
		return {
			filter: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				type: ''
			},

			startDate: {
				active: false
			},
			endDate: {
				active: false
			},
			
		}
   },
   computed: {
		...mapGetters(['contentMaxWidth'])
	},
	beforeMount() {
		
	},
   methods: {
		showFilter() {
			this.filter.active = true;
		},
		clearFilter() {
			this.params.type = '';
			this.filter.type = '';
		},
		onFilterTypeChanged(val) {
			this.params.type = val;
			this.filter.active = false;
      },
		onStartDateChanged() {
			this.startDate.active = false;
		},
		onEndDateChanged() {
			this.errors.remove('endDateText');
			this.endDate.active = false;
		},
		onStartDateClear() {
			this.params.start = '';
		},
		onEndDateClear() {
			this.params.end = '';
			this.errors.remove('endDateText');
		},
		checkDate() {
			
			let start = this.params.start;
			let end = this.params.end;
			//如果結束日期空白, 不用驗證
			if(!end) return true;

			//如果起始日期空白, 不用驗證
			if(!start) return true;
			
			let startDate = moment(start);
			console.log('startDate', startDate);
			let endDate = moment(end);
			console.log('endDate',endDate);
			return endDate.isAfter(startDate);
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('price', '金額').replace('startDateText', '開始日期');
			}
			return '';
		},
		addEndDateError(msg = '日期錯誤') {
			this.errors.add({
				field: 'endDateText',
				msg
			});
		},
		clearEndDateError() {
			this.errors.remove('endDateText');
		},
		onSubmit() {
         this.$validator.validate().then(valid => {
				if(valid) {
					let dateValid = this.checkDate();
					if(dateValid) {
						this.errors.clear();
						this.submit();
					}else {
						this.addEndDateError();
					}
				} 
         });         
		},
		submit() {
			this.$emit('submit');
		},
   }
}
</script>

<style>

</style>