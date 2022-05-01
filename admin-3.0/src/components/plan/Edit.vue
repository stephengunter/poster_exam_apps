<template>
	<v-card>
		<v-card-title>
			<h3>{{ title }}</h3>
			<span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
			<v-spacer />
			<v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<validation-observer ref="validator">
				<v-container>
					<v-row>
						<v-col cols="12">
							<validation-provider v-slot="{ errors }" name="名稱" rules="required">
								<v-text-field label="名稱" v-model="model.name" required
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="12" sm="6">
							<validation-provider v-slot="{ errors }" name="金額" rules="required|numeric">
								<v-text-field label="金額" v-model="model.price" required
								:error-messages="errors"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field label="折扣" readonly
							:value="model.discount"
							/>
						</v-col>
						<v-col cols="12">
							<validation-provider v-slot="{ errors }" name="期間" rules="required">
								<v-text-field :value="dateSelector.text" label="期間" readonly
								:error-messages="errors"
								@click.prevent="selectDate"
								/>
							</validation-provider>
						</v-col>
						<v-col cols="12">
							<v-textarea v-model="model.description" label="說明" outlined auto-grow
							name="text" rows="8" row-height="15"
							/>
						</v-col>
					</v-row>

					<core-error-list />

					<v-row>
						<v-col cols="6" class="text-left">
							<v-btn v-if="canRemove" @click.prevent="remove" color="error">刪除</v-btn>
						</v-col>
						<v-col cols="6" class="text-right">
							<v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</validation-observer>
		</v-card-text>

		<v-dialog v-model="dateSelector.active" :max-width="dateSelector.maxWidth" persistent>
			<core-period-selector :required_start="true" :required_end="false"
			title="選擇期間"
			:version="dateSelector.version"
			:start="dateSelector.start" :end="dateSelector.end"
			@submit="onDateSelected" @cancel="dateSelector.active = false"
			/>
		</v-dialog>
	</v-card>
	
</template>


<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { SET_LOADING } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { addErrorMsg, getErrorMsg, clearErrors } from '@/utils';

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

			dateSelector: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				version: 0,
            start: '',
				end: '',
            text: ''
         },

			references: {}
		}
	},
	computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		mode() {
			if(this.model && this.model.id) return 'edit';
			return 'create';
		},
		title() {
			let text = '方案';
			if(this.mode === 'edit') return `編輯${text}`;
			return `新增${text}`;	
		},
		canRemove() {
			if(this.model.active) return false;
			return this.mode === 'edit';
		},
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	beforeMount() {
		this.setPeriodText();
	},
	mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
		selectDate() {
			this.dateSelector.start = this.model.startDateText ? this.model.startDateText : '';
			this.dateSelector.end = this.model.endDateText ? this.model.endDateText : '';
			this.dateSelector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.dateSelector.version += 1;
			this.dateSelector.active = true;
		},
		onDateSelected({ start, end }) {
			
			this.model.startDateText = start;
			this.model.endDateText = end;

			this.dateSelector.active = false;
			this.dateSelector.text = '';

			this.setPeriodText();
		},
		setPeriodText() {
			let start = this.model.startDateText;
			let end = this.model.endDateText;
			if(start) this.dateSelector.text = `${start} 起`;
			if(end) this.dateSelector.text += ` ${end} 止`;
		},
		convertPrice(val) {
			if(val % 2 === 0) return Number(val);
			return 0;
		},
		addPriceError(msg) {
			addErrorMsg(this.validator, '金額', msg);
		},
		remove(){
			this.$emit('remove', this.model.id);
		},
		cancel(){
			this.validator.reset();
         this.$emit('cancel');
		},
		onSubmit() {
         this.validator.validate().then(valid => {
				if(valid) {
					let price = this.convertPrice(this.model.price);
					if(price) {
						this.model.price = price;
					}else {
						this.addPriceError('金額必須為雙數');
						return;
					}
					
					this.validator.setErrors({});
					this.$emit('submit');
				} 
         });         
		}
	}
}
</script>
