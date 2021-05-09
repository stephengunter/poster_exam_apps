<template>
   <v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		<div v-if="ready">
			<div v-if="existingBill">
				<bill-edit :model="edit.model" :payways="payWays"
				:action="edit.action" :allow_cancel="false"
				@begin-pay-failed="onBeginPayFailed"
				@pay-success="onPaySuccess" @pay-canceled="onPayCanceled"
				/>
			</div>
			<div v-if="newBill">
				<v-row v-if="planSelected">
					<v-col cols="12">
						<bill-edit :model="edit.model" :payways="payWays"
						:allow_cancel="false"
						@created="onBillCreated" @create-bill-failed="onCreateBillFailed"
						/>
					</v-col>
				</v-row>
				<v-row v-else>
					<v-col cols="12">
						<subscribe-plan v-if="plan" :model="plan"
						@select="onPlanSelected"
						/>
					</v-col>
				</v-row>
			</div>
			
		</div>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isBadRequest, getRouteTitle, uuid } from '@/utils';
import { CREATE_SUBSCRIBE, BEGIN_PAY } from '@/store/actions.type';
import { SET_BREAD_ITEMS, SET_LOADING } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'SubscribesCreateView',
	data() {
		return {
			title: '',
			ready: false,

			plan: null,
			planId: 0,

			edit: {
				model: null,
				tradeSPToken: null,
				action: ''
			},

			pay: {
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
				active: false,
			},

			confirm: {
				maxWidth: DIALOG_MAX_WIDTH,
				active: false,
			},
			
			payWays: []
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth']),
		existingBill() {
			if(this.edit.model) {
				return this.edit.model.id > 0;
			}
			return false;
		},
		newBill() {
			if(this.edit.model) {
				return this.edit.model.id < 1;
			}
			return false;
		},
		planSelected() {
			if(this.edit.model) {
				return this.edit.model.planId > 0;
			}
			return false;
		}
	},
	beforeMount() {

		let query = this.$route.query;
		if(query.plan) this.planId = Number(query.plan);

		this.title = getRouteTitle(this.$route);
		this.setTitle();

		this.fetchData();
	},
	methods: {
		setTitle() {
			let items = [{
            action: '', text: this.title
         }];

			if(this.newBill) {
				if(this.planSelected) {
					items.push({
						action: '', text: '確認訂單'
					});
				}
			}

			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		fetchData() {
			this.$store.dispatch(CREATE_SUBSCRIBE)
			.then(model => {
				if(model.bill) this.init(model);
				else this.redirect();
         })
			.catch(error => {
            Bus.$emit('errors', error);
         })
		},
		init(model) {
			
			this.payWays = model.payWays;

			let bill = model.bill;
			this.edit.model = bill;

			if(bill.id) {
				//edit bill 支付未完成的帳單
			}else {
				
				this.plan = model.plan;
				if(this.planId === model.plan.id) this.onPlanSelected();
			}
			
			this.ready = true;
		},
		onPlanSelected() {
			this.edit.model.planId = this.plan.id;
			this.edit.model.plan = this.plan;
			this.setTitle();
		},
		onBillCreated(bill) {
			this.edit.model = bill;
			this.edit.action = BEGIN_PAY;
		},
		onCreateBillFailed() {
			this.redirect();
		},
		onBeginPayFailed() {
			this.redirect();
		},
		onPaySuccess() {
			this.redirect();
		},
		onPayCanceled() {
			this.redirect();
		},
		redirect() {
			this.$store.commit(SET_LOADING, true);
			setTimeout(() => {
				this.$router.push({ path: '/subscribes' });
			}, 500);
		}
	}
}
</script>