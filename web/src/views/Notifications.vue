<template>
   <v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		<v-card v-if="list.length">
			<v-list  three-line>
				<v-list-item v-for="(item, index) in list" :key="index" @click.prevent="select(item)">
					<v-list-item-content>
                  <v-list-item-title v-text="item.notice.title"></v-list-item-title>
						<v-list-item-subtitle class="mt-1" v-text="plainText(item.notice.content)"></v-list-item-subtitle>
					</v-list-item-content>
					<v-list-item-action>
                <v-list-item-action-text>
						 <core-time-ago :val="item.notice.lastUpdated" />
					 </v-list-item-action-text>
              </v-list-item-action>
				</v-list-item>
			</v-list>
			
			
		</v-card>
		<scroll-loader :loader-method="loadMore" :loader-disable="!hasNextPage">
			<div v-show="loading" class="text-center">
				<v-progress-circular color="info" indeterminate size="36">
				</v-progress-circular>
			</div>
		</scroll-loader>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_NOTIFICATION_ITEMS, FETCH_NOTIFICATIONS, CLEAR_NOTIFICATIONS
 } from '@/store/actions.type';
import { onError, getRouteTitle } from '@/utils';
import { SET_BREAD_ITEMS, SET_NOTIFICATION } from '@/store/mutations.type';


export default {
	name: 'NotificationsView',
	data(){
		return {
			
			page: 1,
			pageSize: 12,
			  
			scroller: {
				disable: true
			},

			loading: false
		}
	},
	computed: {
		...mapState({
			params: state => state.notifications.params,
			list: state => state.notifications.list,
			pagedList: state => state.notifications.pagedList
		}),
		hasNextPage() {
			if(this.pagedList) return this.pagedList.hasNextPage;
			return false;
		}
	},
	beforeMount() {
		this.$store.commit(SET_NOTIFICATION, null);

		if(this.list.length) {
			if(this.params) {
				this.page =  this.params.page;
				this.pageSize =  this.params.pageSize;
			}
		}else {
			this.fetchData();
		}

		this.title = getRouteTitle(this.$route);
		this.setTitle();
		
	},
	methods: {
      setTitle() {
			let items = [{
				action: '', text: this.title
			}];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		loadMore() {
			this.loading = true;
			let ids = this.pagedList.viewList.map(item => item.id);
			if(ids.length) {
				this.$store.dispatch(CLEAR_NOTIFICATIONS, ids)
				.then(() => {
					this.page += 1;
					this.fetchData();
				})
				.catch(error => {
					this.loading = false;
					Bus.$emit('errors');
				})
			}
		},
		fetchData() {
			this.loading = true;
			let params = { page: this.page, pageSize: this.pageSize };
			
			this.$store.dispatch(FETCH_NOTIFICATIONS, params)
			.catch(error => {
				onError(error);
			})
			.finally(() => { 
				this.loading = false;
			});
		},
		select(item) {
			this.$router.push({ name: 'notification-details', params: { id: item.id }})
		}
   }
}
</script>

<style>

</style>