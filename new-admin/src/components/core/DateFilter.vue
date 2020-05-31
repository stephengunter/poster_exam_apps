<template>
<ValidationObserver ref="dateFilterForm">
	<v-row>
		<v-col cols="6">
			<v-menu full-width max-width="290"
			v-model="startDate.active"
			:close-on-content-click="false"
			>
				<template v-slot:activator="{ on }">
					<ValidationProvider v-slot="{ errors }" name="startDateText">
					<v-text-field clearable label="開始日期" readonly
						:value="startDate.val" v-on="on"
						:error-messages="errors"
						@click:clear="onStartDateClear"
						/>
					</ValidationProvider>
				</template>
				<v-date-picker locale="zh-cn"
					v-model="startDate.val"
					@input="onStartDateChanged" 
				/>
			</v-menu>
		</v-col>
		<v-col cols="6">
			<v-menu full-width max-width="290"
			v-model="endDate.active"
			:close-on-content-click="false"
			>
				<template v-slot:activator="{ on }">
					<ValidationProvider v-slot="{ errors }" name="endDateText">
						<v-text-field clearable label="結束日期" readonly
						:value="endDate.val" v-on="on"
						:error-messages="errors"
						@click:clear="onEndDateClear"
						/>
					</ValidationProvider>
				</template>
				<v-date-picker locale="zh-cn"
					v-model="endDate.val"
					@input="onEndDateChanged" 
				/>
			</v-menu>
		</v-col>
	</v-row>
</ValidationObserver>	
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';

import { required, email, max } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';
setInteractionMode('eager');

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
	components: {
		ValidationProvider,
		ValidationObserver
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
			},
			
			references: {}
		}
	},
	computed: {
		dateFilterForm() {
			if(this.$refs.dateFilterForm) return this.$refs.dateFilterForm;
			else if (this.references.dateFilterForm) return this.references.dateFilterForm;
			return null;
		}
	},
	beforeMount() {
		this.startDate.val = this.start;
		this.endDate.val = this.end;
	},
	mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
		onStartDateChanged() {
			this.startDate.active = false;
		},
		onEndDateChanged() {
			//this.errors.remove('endDateText');
			this.endDate.active = false;
		},
		onStartDateClear() {
			this.startDate.val = '';
		},
		onEndDateClear() {
			this.endDate.val = '';
			//this.errors.remove('endDateText');
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
		// getErrMsg(key){
		// 	let err = this.errors.collect(key);
		// 	if(err && err.length){
		// 		let msg = err[0];
		// 		return msg.replace('startDateText', '開始日期').replace('endDateText', '結束日期');
		// 	}
		// 	return '';
		// },
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
         this.dateFilterForm.validate().then(valid => {
				console.log(valid);
				return;
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