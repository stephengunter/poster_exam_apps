<template>
   <v-container>
      <div class="mb-2">
			<core-bread />
      </div>
		<v-card v-if="list.length">
			<v-list>
				<v-list-item v-for="(item, index) in list" :key="index">
					<v-list-item-icon v-if="item.top">
						<v-chip  small color="orange" text-color="white">
							置頂<v-icon small right>mdi-star</v-icon>
						</v-chip>
					</v-list-item-icon>
					<v-list-item-content>
						<router-link :to="`/notices/${item.id}`" class="a-btn">
							<v-list-item-title v-text="item.title"></v-list-item-title>
						</router-link> 
					</v-list-item-content>
					<v-list-item-action>
                <v-list-item-action-text>
						<span>{{ item.lastUpdated | timeAgo }}</span>
					 </v-list-item-action-text>
              </v-list-item-action>
				</v-list-item>
			</v-list>
			<scroll-loader :loader-method="loadMore" :loader-disable="!hasNextPage">
			</scroll-loader>
		</v-card>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_NOTICES } from '@/store/actions.type';
import { onError, getRouteTitle } from '@/utils';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';


export default {
	name: 'NoticesView',
	data(){
		return {
			title: '',
			page: 1,
			pageSize: 15,
			  
			scroller: {
				disable: true
			}
		}
	},
	computed: {
		...mapState({
			params: state => state.notices.params,
			list: state => state.notices.list,
			pagedList: state => state.notices.pagedList
		}),
		hasNextPage() {
			if(this.pagedList) return this.pagedList.hasNextPage;
			return false;
		}
	},
	beforeMount() {
		if(this.list.length) {
			if(this.params) {
				this.page =  this.params.page;
				this.pageSize =  this.params.pageSize;
			}
			
		}else {
			this.fetchData();
		}

		let title = getRouteTitle(this.$route);
		this.setTitle(title);
		
	},
	methods: {
      setTitle(title) {
			let items = [{
				action: '', text: title
			}];
			this.$store.commit(SET_BREAD_ITEMS, items);
		},
		loadMore() {
			this.page += 1;
			this.fetchData();
		},
		fetchData() {
			let params = { page: this.page, pageSize: this.pageSize };
			
			this.$store.dispatch(FETCH_NOTICES, params)
			.catch(error => {
				onError(error);
			})
		}
   }
}
</script>

<style>

</style>