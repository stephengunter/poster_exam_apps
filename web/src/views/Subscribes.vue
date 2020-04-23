<template>
   <v-container>
      <div class="mb-2">
			<core-bread :items="bread.items"
			/>
      </div>
		<div v-if="ready">
			<v-row v-if="!currentSubscribe">
				<v-col cols="12">
					<subscribe-alert :can_create="canCreate"
					@submit="subscribeNow"
					/>
				</v-col>
			</v-row>
			
			<v-row>
				<v-col cols="12">
					<v-tabs v-model="tab">
						<v-tab v-for="(tab, index) in tabs" :key="index" @change="onTabChanged(tab.key)">
						{{ tab.title }}
						</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tab">
						<v-tab-item>
							<bill-list />
						</v-tab-item>
						<v-tab-item>
							<subscribe-table v-if="selectedTabKey === 'records'"
							:list="records"
							/>
							
						</v-tab-item>
					</v-tabs-items>
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
	name: 'SubscribesView',
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

			tab: null,
			selectedTabKey: '',
			tabs:[{
				key: 'bills', title: '訂單查詢'
			},{
				key: 'records', title: '訂閱紀錄'
			}],
		}
	},
	computed: {
		...mapGetters(['loading','currentSubscribe']),
		...mapState({
			records: state => state.subscribes.records,
			canCreate: state => state.subscribes.canCreate
		}),
	},
	beforeMount() {
		this.title = getRouteTitle(this.$route);
		this.setTitle();

		this.selectedTabKey = this.tabs[0].key;

		this.fetchData();
	},
	methods: {
		setTitle() {
			this.clearBread();
			this.addBreadItem('', this.title);
		},
		clearBread() {
         this.bread.items = [];
      },
		addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
		},
		subscribeNow() {
			console.log('subscribeNow');
			this.$router.push({ path: '/subscribes/create' });
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
		onTabChanged(val) {
			console.log('onTabChanged', val);
		},
		init() {
			this.ready = true;
		}
	}
}
</script>