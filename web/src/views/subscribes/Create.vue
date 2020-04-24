<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
      </div>
		<div v-if="ready">
			<div v-if="existingBill">
				<bill-details :model="edit.model" :payway_options="paywayOptions"
				:allow_cancel="false"
				/>
			</div>
			<div v-else>
				<v-row v-if="planSelected">
					<v-col cols="12">
						<subscribe-confirm :model="edit.model" :payway_options="paywayOptions"
						@submit="onSubmit"
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
import { resolveErrorData, getRouteTitle, uuid } from '@/utils';
import { SUBSCRIBES_INDEX, CREATE_SUBSCRIBE, 
STORE_SUBSCRIBE, STORE_PAY } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';

export default {
	name: 'SubscribesCreateView',
	data() {
		return {
			title: '',
			ready: false,
         bread: {
            items: []
			},

			plan: null,
			planId: 0,

			edit: {
				model: null,
			},

			bill: null,
			
			paywayOptions: []
		}
	},
	computed: {
		//...mapGetters(['plan', 'payWays']),
		existingBill() {
			if(this.edit.model) {
				return this.edit.model.id > 0;
			}
			return false;
		},
		planSelected() {
			if(this.edit.model) return true;
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
			this.clearBread();
			this.addBreadItem('', this.title);

			if(this.edit.model) this.addBreadItem('', '確認訂單');
		},
		clearBread() {
         this.bread.items = [];
      },
		addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
		},
		fetchData() {
			this.$store.dispatch(CREATE_SUBSCRIBE)
			.then(model => {
				console.log('model', model);
				if(model.bill) {
					this.init(model);
				}else this.redirect();
				
				// if(canCreate) {
				// 	this.$nextTick(() => {
				// 		this.init();
				// 	});
				// }else {
				// 	this.redirect();
				// }
         })
			.catch(error => {
            Bus.$emit('errors', error);
         })
		},
		init(model) {
			
			this.paywayOptions = model.payWays.map(item => ({
				value: item.id, text: item.title
			}));

			let bill = model.bill;

			if(bill.id) {
				//edit bill 支付未完成的帳單
			}else {
				this.plan = model.plan;
				if(this.planId === model.plan.id) bill.planId = this.planId;
			}

			this.edit.model = bill;
			
			
			this.ready = true;
		},
		onPlanSelected() {
			this.edit.model = {
				plan: {
					...this.plan
				},
				payWayId: this.payWays.length ? this.payWays[0].id : 0 
			};
			this.setTitle();
		},
		onPlanNotFound() {

		},
		onSubmit() {
			this.bill = null;
			let model = this.edit.model;
			this.$store.dispatch(STORE_SUBSCRIBE, model)
			.then(bill => {
				this.bill = bill;
				this.$nextTick(() => {
					this.beginPay(bill);
				});
         })
			.catch(error => {
				console.log('error', error);
				//Bus.$emit('errors', error);
				//this.redirect();
         })
		},
		beginPay(bill) {
			//開始支付
			
			console.log('beginPay', bill);
			//以下為測試
			let model = {
				id: uuid(),
				billId: bill.id,
				money: String(bill.amount),
				payWay: this.payWays.find(item => item.id === bill.payWayId).code
			};
			this.$store.dispatch(STORE_PAY, model)
			.then(() => {
				Bus.$emit('success');
         })
			.catch(error => {
				console.log('error', error);
				//Bus.$emit('errors', error);
				//this.redirect();
         })
		},
		redirect() {
			this.$router.push({ path: '/subscribes' });
		}
	}
}
</script>