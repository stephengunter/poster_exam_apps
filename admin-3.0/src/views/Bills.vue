<template>
   <core-container>
		<v-row>
			<v-col cols="12" sm="6" >
				<v-select label="方案"
				:items="plansOptions" v-model="params.plan"
				@change="onPlanChanged"
				/>
			</v-col>
			<v-col cols="12" sm="6">
				<v-radio-group v-model="params.payed" row @change="onPayedChanged">
					<v-radio v-for="(item, index) in payedOptions" :key="index"
					:label="item.text" :value="item.value"
					/>
				</v-radio-group>
				<v-btn v-show="!params.payed" small color="warning" @click.prevent="clearBills">
              清除無效帳單
            </v-btn>
			</v-col>
		</v-row>
		<v-row v-if="pagedList">
         <v-col cols="12">
            <bill-table :list="dataList"
				:payed="payed" :show_plan ="!planSelected"
				@selected="onBillSelected"
				/>
         </v-col>
      </v-row>
		
		<core-table-pager v-if="pagedList" v-show="dataList.length > 0"
		:model="pagedList" :responsive="responsive"
		@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
		/>

		<v-dialog v-model="details.active" persistent :max-width="details.maxWidth">
			<bill-details v-if="details.active" :model="details.model"
			@cancel="cancelDetails"
			/>
		</v-dialog>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR } from '@/store/mutations.type';
import { FETCH_PLANS, FETCH_BILLS, BILL_DETAILS, CLEAR_BILLS } from '@/store/actions.type';
import { onError, scrollToTop, isTrue } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'BillsView',
   data () {
		return {
			payedOptions: [{
				value: 1,
				text: '已付款'
			},{
				value: 0,
				text: '未付款'
			}],
			params: {
				plan: -1,
				payed: 1,
				page: 1,
				pageSize: 10
			},
			plansOptions: [],
			details: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
			},
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			allPlans: state => state.plans.all,
			pagedList: state => state.bills.pagedList,
		}),
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
      },
		planSelected() {
			return this.params.plan > 0;
		},
		selectedPlan() {
			return this.planSelected ? this.allPlans.find(x => x.id === this.params.plan) : null;
		},
		payed() {
			return isTrue(this.params.payed);
		}
   },
   beforeMount() {
		
		if(this.allPlans.length) {
			this.loadPlans(this.allPlans);
			if(this.params.plan < 1) this.params.plan = this.allPlans[0].id;
			this.fetchData();
		}else {
			this.$store.dispatch(FETCH_PLANS)
			.then(plans => {
				this.loadPlans(plans);
				if(this.params.plan < 1) this.params.plan = plans[0].id;
				this.fetchData();
			})
			.catch(error => {
				onError(error);
			})
		}
   },
   methods: {
		loadPlans(plans) {
			let options = plans.map(plan => {
				let value = plan.id;
				let text = `${plan.name} (${plan.startDateText} ~ ${plan.endDateText})`;
				return { value, text }
			});
			this.plansOptions = [{ value: 0, text: '全部方案' }].concat(options);
		},
		fetchData() {
			this.$store.dispatch(FETCH_BILLS, this.params)
			.catch(error => {
				onError(error);
			});

			scrollToTop();
		},
		onPayedChanged() {
			this.fetchData();
      },
		onPlanChanged(val) {
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
		onBillSelected(id) {
			this.$store.dispatch(BILL_DETAILS, id)
			.then(model => {
				this.setDetailsModel(model);
			})
			.catch(error => {
				onError(error);
			})
		},
		setDetailsModel(model) {
			if(model) {
				this.details.model = model;
				this.details.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.details.active = true;
			}else {
				this.details.model = null;
				this.details.active = false;
			}
		},
		cancelDetails() {
			this.setDetailsModel(null);
		},
		clearBills() {
			let plan = this.selectedPlan;
			let title = '確定要清除所有無效帳單嗎?';
			if(plan) title = `確定要清除方案${plan.name}下的無效帳單嗎?`;
			Bus.$emit('show-confirm', {
				type: 'error',
				title: title,
				onOk: this.submitClearBills,
				onCancel: () => {  }
			});
		},
		submitClearBills() {
			this.$store.commit(CLEAR_ERROR);
			let plan = this.selectedPlan ? this.selectedPlan.id : 0;
			this.$store.dispatch(CLEAR_BILLS, plan)
			.then(() => {
				this.fetchData();
			})
			.catch(error => {
				onError(error);
			})
		}
	}
}
</script>