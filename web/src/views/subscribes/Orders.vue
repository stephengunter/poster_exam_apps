<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
      </div>
		<div v-if="ready">
			<v-row v-if="planSelected">
				<v-col cols="12">
					<subscribe-confirm :model="edit.model"
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
		
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, getRouteTitle } from '@/utils';
import { SUBSCRIBES_INDEX, FETCH_PLANS } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';

export default {
	name: 'SubscribesOrdersView',
	data() {
		return {
			title: '',
			ready: false,
         bread: {
            items: []
			},
			planId: 0,

			edit: {
				model: null
			},
			
			payway: 0,
			paywayOptions: [{
				text: 'LINE Pay', value: 0
			},{
				text: '電力商店繳費', value: 1
			}]
		}
	},
	computed: {
		...mapGetters(['plan']),
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
			this.$store.commit(SET_LOADING, true);
			this.$store.dispatch(SUBSCRIBES_INDEX)
			.then(() => {
				this.$nextTick(() => {
					this.init();
				});
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
         })
			.finally(() => { 
				this.$store.commit(SET_LOADING, false);
			});
		},
		init() {
			if(!this.plan) {
				this.onPlanNotFound();
				return false;
			}

			if(this.planId === this.plan.id) {
				this.onPlanSelected();
			}

			
			this.ready = true;
		},
		onPlanSelected() {
			this.edit.model = {
				plan: {
					...this.plan
				},
				payway: 0
			};
			this.setTitle();
		},
		onPlanNotFound() {

		}
	}
}
</script>