<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
      </div>
		<v-row v-if="false">
			<v-col cols="12">
				<subscribe-plan :model="plan" 
				@select="onPlanSelected"
				/>
			</v-col>
		</v-row>
		<v-row v-if="createMode">
			<v-col cols="12">
				<subscribe-confirm :model="edit.model"
				/>
			</v-col>
		</v-row>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData, getRouteTitle } from '@/utils';
import { SUBSCRIBES_INDEX, FETCH_PLANS } from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';

export default {
	name: 'SubscribesView',
	data() {
		return {
			title: '',
			mode: 'index',
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
		...mapGetters(['isAuthenticated', 'currentUser','responsive', 'plan']),
		indexMode() {
			return this.mode === 'index';
		},
		confirmMode() {
			return this.mode === 'confirm';
		},
		createMode() {
			return this.mode === 'create';
		},
		recordsMode() {
			return this.mode === 'records';
		}
	},
	beforeMount() {
		let query = this.$route.query;
		if(query.plan) this.planId = Number(query.plan);

		this.title = getRouteTitle(this.$route);
		//this.setMode('index');
		this.fetchData();
	},
	methods: {
		setMode(mode) {
			this.mode = mode;
			this.clearBread();

			this.addBreadItem('', this.title);

			if(this.indexMode) {
				
			}else if(this.createMode) {
				if(this.edit.model) this.addBreadItem('', '確認訂單');
            
         }
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
			if(this.plan && this.planId === this.plan.id) {
				this.edit.model = {
					plan: {
						...this.plan
					},
					payway: 0
				};
				this.setMode('create');

				console.log(this.edit.model);
			}
		},
		onPlanSelected() {

		}
	}
}
</script>

<style scoped>
.item-price {
	color: #ee4d2d;
   font-weight: 400;	
}
.price-number{
	font-size: 155%;
	max-width: 130px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>