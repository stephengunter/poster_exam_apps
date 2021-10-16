<template>
   <core-container>
		<v-row>
			<v-col cols="12">
				<v-select label="方案"
				:items="plansOptions" v-model="params.plan"
				@change="onPlanChanged"
				/>
			</v-col>
		</v-row>
		<v-row v-if="pagedList">
         <v-col cols="12">
            <subscribe-table :list="dataList"
				/>
         </v-col>
      </v-row>
		<core-table-pager v-if="pagedList" v-show="dataList.length > 0"
		:model="pagedList" :responsive="responsive"
		@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
		/>
	</core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_SUBSCRIBES } from '@/store/actions.type';
import { onError, scrollToTop } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'SubscribesView',
   data () {
		return {
			params: {
				plan: 0,
				page: -1,
				pageSize: 10
			},
			plansOptions: [],
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			pagedList: state => state.subscribes.pagedList,
		}),
		dataList() {
			if(this.pagedList) {
				return this.pagedList.viewList;
			} return [];
      },
		firstLoad() {
			return this.params.page < 0;
		}
   },
   beforeMount() {
		this.fetchData();
   },
   methods: {
		fetchData(){
			this.$store.dispatch(FETCH_SUBSCRIBES, this.params)
			.then(model => {
				if(model.plansOptions.length) {
					this.plansOptions = model.plansOptions.slice(0);
					if(this.params.plan < 1) this.params.plan = model.plansOptions[0].value;
				} 
				if(this.firstLoad) this.params.page = 1;
				console.log(this.params);
			})
			.catch(error => {
				onError(error);
			});

			scrollToTop();
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
	}
}
</script>