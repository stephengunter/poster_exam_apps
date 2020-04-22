<template>
<div>
	<form @submit.prevent="onSubmit">
		<v-card>
			<v-card-title>
				<span class="headline">{{ title }}</span>
				<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
				<v-spacer />
				<a href="#" @click.prevent="cancel">
					<v-icon>mdi-window-close</v-icon>
				</a>
			</v-card-title>
			<v-card-text>
				<v-container grid-list-md>
					<v-layout wrap>
						<v-flex xs12 sm6>
							<v-text-field v-model="model.price" label="金額"
							v-validate="'required|numeric'"
							:error-messages="getErrMsg('price')"
							name="price"
							required
							/>
						</v-flex>
						<v-flex xs12 sm6>
							<v-text-field label="折扣" readonly
							:value="model.discount"
							/>
						</v-flex>
						<v-flex xs12 sm6>
							<v-menu full-width max-width="290"
							v-model="startDate.active"
							:close-on-content-click="false"
							>
								<template v-slot:activator="{ on }">
									<v-text-field clearable label="開始日期" readonly
									:value="model.startDateText" v-on="on"
									v-validate="'required'"
									:error-messages="getErrMsg('startDateText')"
									name="startDateText"
									required
									/>
								</template>
								<v-date-picker locale="zh-cn"
									v-model="model.startDateText"
									@input="onStartDateChanged" 
								/>
							</v-menu>
						</v-flex>
						<v-flex xs12 sm6>
							<v-menu full-width max-width="290"
							v-model="endDate.active"
							:close-on-content-click="false"
							>
								<template v-slot:activator="{ on }">
									<v-text-field clearable label="結束日期" readonly
									:value="model.endDateText" v-on="on"
									:error-messages="getErrMsg('endDateText')"
									name="endDateText" @click:clear="onEndDateClear"
									/>
								</template>
								<v-date-picker locale="zh-cn"
									v-model="model.endDateText"
									@input="onEndDateChanged" 
								/>
							</v-menu>
						</v-flex>
						<v-flex xs12>
							<v-textarea v-model="model.description" label="說明" outlined auto-grow
							name="text"
							rows="5"
							row-height="15"
							/>
						</v-flex>
					</v-layout>
					<core-error-list  />
				</v-container>
			</v-card-text>

			<v-card-actions>
				<v-btn v-if="canRemove" @click.prevent="remove" color="error darken-1">刪除</v-btn>
				<v-spacer />
				<v-btn type="submit" @click.prevent="onSubmit" color="primary">存檔</v-btn>
			</v-card-actions>
		</v-card>
	</form>
</div>	
</template>


<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING } from '@/store/mutations.type';

export default {
	name: 'PlanEdit',
	props: {
		model: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			startDate: {
				active: false
			},
			endDate: {
				active: false
			},
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		mode(){
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title(){
			let text = '方案';

			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove(){
			if(this.model.active) return false;
			return this.mode === 'edit';
		}
	},
	beforeMount(){
	},
	methods: {
		getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('price', '金額').replace('startDateText', '開始日期');
			}
			return '';
		},
		onStartDateChanged(val) {
			this.errors.remove('startDateText');
			this.startDate.active = false;
		},
		onEndDateChanged(val) {
			this.errors.remove('endDateText');
			this.endDate.active = false;
		},
		onEndDateClear() {
			this.model.endDateText = '';
			this.errors.remove('endDateText');
		},
		checkDate() {
			//如果結束日期空白, 不用驗證
			if(!this.model.endDateText) return true;

			let startDate = moment(this.model.startDateText);
			let endDate = moment(this.model.endDateText);
			return endDate.isAfter(startDate);
		},
		convertPrice(val) {
			if(val % 2 === 0) {
				return Number(val);
			}else return 0;
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
		remove(){
			this.$emit('remove');
		},
		cancel(){
			this.errors.clear();
         this.$emit('cancel');
		},
		onSubmit() {
         this.$validator.validate().then(valid => {
				if(valid) {
					let price = this.convertPrice(this.model.price);
					if(price) {
						this.model.price = price;
					}else {
						this.errors.add({
							field: 'price',
							msg: '金額必須為雙數'
						});
						return;
					}

					let dateValid = this.checkDate();
					if(dateValid) {
						this.errors.clear();
						this.$emit('submit');
					}else {
						this.addEndDateError();
					}
				} 
         });         
		}
	}
}
</script>
