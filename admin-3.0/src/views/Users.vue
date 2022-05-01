<template>
   <core-container>
      <v-row>
         <v-col cols="12" sm="6">
            <v-select label="角色" @change="onRoleChanged"
               :items="roleOptions" v-model="params.role"
            />
         </v-col>
         <v-col cols="12" sm="6">
            <core-search :keyword="params.keyword"
            @submit="onKeywordSubmit"
            />
         </v-col>
      </v-row>
      <v-row v-if="pagedList">
         <v-col cols="12">
            <user-table :list="dataList"
				/>
         </v-col>
      </v-row>
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_USERS } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { onError, scrollToTop } from '@/utils';

export default {
   name: 'UsersView',
   data () {
      return {
         params: {
            role: '',
            keyword: '',
            page: -1,
            pageSize: 10
         },
         
         headers: [
				{
					sortable: false,
					text: 'Name',
					value: 'name'
				},
				{
					sortable: false,
					text: 'UserName',
					value: 'userName'
				},
				{
					sortable: false,
					text: 'Email',
					value: 'email'
            },
            {
					sortable: false,
					text: '角色',
					value: 'roles'
            },
            {
					sortable: false,
					text: '加入日期',
					value: 'createdAtText'
				}
			]
      }
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
         pagedList: state => state.users.pagedList,
         roleOptions: state => state.users.roleOptions
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
   beforeMount(){
		this.fetchData();
	},
   methods: {
      fetchData() {
         this.$store.dispatch(FETCH_USERS, this.params)
         .then(() => {
				if(this.firstLoad) this.params.page = 1;
			})
			.catch(error => {
				onError(error);
         });
         
         scrollToTop();
      },
      onKeywordSubmit(val) {
         this.params.keyword = val;
         this.onParamsChanged();
      },
      onRoleChanged(val) {
         this.onParamsChanged();
      },
      onParamsChanged() {
         this.params.page = 1;
			this.fetchData();
		},
      onPageChanged(page){
			this.params.page = page;
			this.fetchData();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.params.page = 1;
			this.fetchData();
		}
   }
}
</script>