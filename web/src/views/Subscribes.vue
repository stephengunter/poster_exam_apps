<template>
   <v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		<div v-if="ready">
			<v-row>
				<v-col cols="12">
					<subscribe-current v-if="currentSubscribe" :model="currentSubscribe"
					/>
					<subscribe-alert v-else :can_create="canCreate"
					@submit="subscribeNow"
					/>
				</v-col>
			</v-row>
			
			<v-row>
				<v-col cols="12">
					<v-tabs v-model="tab">
						<v-tab v-for="(tab, index) in tabs" :key="index">
						{{ tab.title }}
						</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tab">
						<v-tab-item>
							<bill-list :list="bills"
							@selected="onBillSelected"
							/>
						</v-tab-item>
						<v-tab-item>
							<subscribe-list :list="records"
							/>
						</v-tab-item>
					</v-tabs-items>
				</v-col>
			</v-row>
		</div>

		<v-dialog v-model="bill.active" :max-width="bill.maxWidth" persistent>
			<bill-details v-if="bill.model && bill.model.payed" :model="bill.model"
			 @cancel="cancelSelectBill"
			/>

			<bill-edit v-if="bill.model && !bill.model.payed" :model="bill.model" :payways="payWays"
			:allow_cancel="true" @cancel="cancelSelectBill"
			@begin-pay-failed="onBeginPayFailed"
			@pay-success="onPaySuccess" @pay-canceled="onPayCanceled"
			/>
		</v-dialog>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, getRouteTitle } from '@/utils';
import { SUBSCRIBES_INDEX, FETCH_PLANS, EDIT_BILL, BILL_DETAILS } from '@/store/actions.type';
import { SET_BREAD_ITEMS, SET_LOADING, SET_AUTH_CHANGED } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'SubscribesView',
	data() {
		return {
		  
			title: '',
			ready: false,

			planId: 0,

			bill: {
				model: null,
				payed: false,
            maxWidth: DIALOG_MAX_WIDTH,
            active: false
			},

			tab: null,
			tabs:[{
				key: 'bills', title: '訂單查詢'
			},{
				key: 'records', title: '訂閱紀錄'
			}],

			payWays: []
		}
	},
	computed: {
		...mapGetters(['currentSubscribe', 'contentMaxWidth']),
		...mapState({
			bills: state => state.subscribes.bills,
			records: state => state.subscribes.records,
			canCreate: state => state.subscribes.canCreate
		}),
	},
	beforeMount() {
		this.init();
	},
	methods: {
		init() {
			this.ready = false;
			this.planId = 0;

			this.bill = {
				model: null,
				payed: false,
            maxWidth: DIALOG_MAX_WIDTH,
            active: false
			};

			this.tab = null;
			this.payWays = [];

			this.title = getRouteTitle(this.$route);
			this.setTitle();

			this.fetchData();
		},
		setTitle() {
			let items = [{
            action: '', text: this.title
         }];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		subscribeNow() {
			this.$router.push({ path: '/subscribes/create' });
		},
		fetchData() {
			this.$store.commit(SET_LOADING, true);
			this.$store.dispatch(SUBSCRIBES_INDEX)
			.then(() => {
				this.$nextTick(() => {
					this.onReady();
				});
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
         })
			.finally(() => { 
				this.$store.commit(SET_LOADING, false);
			});
		},
		onReady() {
			this.ready = true;
		},
		onBillSelected(bill) {
			let id =  bill.id;
			if(bill.payed) this.billDetails(id);
			else this.editBill(id);
		},
		billDetails(id) {
			this.$store.dispatch(BILL_DETAILS, id)
			.then(bill => {
				this.bill.model = bill;
				this.bill.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.bill.active = true;
         })
			.catch(error => {
            Bus.$emit('errors', error);
         })
		},
		editBill(id) {
			this.$store.dispatch(EDIT_BILL, id)
			.then(form => {
				this.payWays = form.payWays;

				this.bill.model = form.bill;
				this.bill.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.bill.active = true;
         })
			.catch(error => {
            Bus.$emit('errors', error);
         })
		},
		cancelSelectBill() {
			this.bill.active = false;
			this.bill.model = null;
		},
		onBeginPayFailed() {
			this.init();
		},
		onPayCanceled() {
			this.init();
		},
		onPaySuccess() {
			this.cancelSelectBill();

			this.$store.commit(SET_LOADING, true);
			setTimeout(() => {
				Bus.$emit('re-login', () => {
					this.$store.commit(SET_AUTH_CHANGED, false);
					this.init();
				})
			}, 500);
		}
	}
}
</script>