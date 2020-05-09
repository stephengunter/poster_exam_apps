<template>
	<v-layout row wrap>
		<v-flex xs6>
			<v-menu full-width max-width="290"
			v-model="startDate.active"
			:close-on-content-click="false"
			>
				<template v-slot:activator="{ on }">
					<v-text-field clearable label="開始日期" readonly
					:value="startDate.val" v-on="on"
					name="startDateText"
					@click:clear="onStartDateClear"
					/>
				</template>
				<v-date-picker locale="zh-cn"
					v-model="startDate.val"
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
					:value="endDate.val" v-on="on"
					:error-messages="getErrMsg('endDateText')"
					name="endDateText"
					@click:clear="onEndDateClear"
					/>
				</template>
				<v-date-picker locale="zh-cn"
					v-model="endDate.val"
					@input="onEndDateChanged" 
				/>
			</v-menu>
		</v-flex>
	</v-layout>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';

export default {
   name: 'DateFilter',
   props: {
		start: {
			type: String,
			default: ''
		},
		end: {
			type: String,
			default: ''
		},
		version: {
			type: Number,
			default: 0
		}
	},
   data () {
		return {
			startDate: {
				val: '',
				active: false
			},
			endDate: {
				val: '',
				active: false
			}			
		}
	},
	beforeMount() {
		this.startDate.val = this.start;
		this.endDate.val = this.end;
	},
   methods: {
		onStartDateChanged() {
			this.startDate.active = false;
		},
		onEndDateChanged() {
			this.errors.remove('endDateText');
			this.endDate.active = false;
		},
		onStartDateClear() {
			this.startDate.val = '';
		},
		onEndDateClear() {
			this.endDate.val = '';
			this.errors.remove('endDateText');
		},
		checkDate() {
			
			let start = this.startDate.val;
			let end = this.endDate.val;
			//如果結束日期空白, 不用驗證
			if(!end) return true;

			//如果起始日期空白, 不用驗證
			if(!start) return true;
			
			let startDate = moment(start);
			let endDate = moment(end);
			return endDate.isSameOrAfter(startDate);
		},
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('startDateText', '開始日期').replace('endDateText', '結束日期');
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
						let start = this.startDate.val;
						let end = this.endDate.val;
						this.submit();
					}else {
						this.addEndDateError();
					}
				} 
         });         
		},
		submit() {
			let start = this.startDate.val;
			let end = this.endDate.val;
			this.$emit('submit', { start, end });
		},
   }
}
</script>

<style>

</style>