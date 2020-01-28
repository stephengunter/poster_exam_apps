<template>
   <v-container fluid grid-list-xl fill-height>
      <v-layout justify-center  align-center>
         <v-flex xs12>
            <material-card>
               <v-layout row wrap>
                  <v-flex xs6 sm6 md6>
							<v-select label="角色" @change="onRoleChanged"
                        :items="roleOptions" v-model="params.role"
                     />
						</v-flex>
                  <v-flex xs6 sm6 md6>
                     <form @submit.prevent="search">
                        <v-text-field
                           v-model="params.keyword"
                           label="Search"
                           single-line
                           hide-details
                        >
                           <template v-slot:prepend>
										<v-icon>mdi-magnify</v-icon>
									</template>
									<template v-slot:append>
										<a href="#" v-show="params.keyword" @click.prevent="clearSearch">
											<v-icon>mdi-close</v-icon>
										</a>
									</template>
                        </v-text-field>
                     </form>
                  </v-flex>
                  
               </v-layout>
               <v-layout row wrap v-if="pageList">
                  <v-flex sm12>
							<v-data-table :headers="headers" :items="users" hide-actions>
                        <template slot="headerCell" slot-scope="{ header }">
                           <span class="subheading font-weight-light text-success text--darken-3 cn">
                              {{ header.text }}
                           </span>
                        </template>
                        <template slot="items" slot-scope="props">
                           <td>{{ props.item.name }}</td>
                           <td>{{ props.item.userName }}</td>
                           <td>{{ props.item.email }}</td>
                           <td>{{ props.item.roles }}</td>
                           <td>{{ props.item.createdAtText }}</td>
                        </template>
                     </v-data-table>
						</v-flex>
                  <v-flex sm12>
							<core-table-pager :model="pageList" :responsive="responsive" v-show="pageList.viewList.length > 0" 
								@pageChanged="onPageChanged" @sizeChanged="onPageSizeChanged"
							/>
						</v-flex>
               </v-layout>
            </material-card>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_USERS } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

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
         roleOptions: [{
            value: '',
            text: '全部'
         }],
         
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
					text: 'Roles',
					value: 'roles'
            },
            {
					sortable: false,
					text: 'CreatedAt',
					value: 'createdAt'
				}
			]
      }
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			pageList: state => state.users.pageList,
      }),
      users(){
         return this.pageList ? this.pageList.viewList : [];
		}
   },
   beforeMount(){
		this.init();
	},
   methods: {
      init(){
			this.fetchData();
      },
      fetchData(params) {
         if(!params) params = this.params;

			this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(FETCH_USERS, params)
         .then(model => {
            if(model.rolesOptions.length) {
               this.roleOptions = model.rolesOptions.slice(0);
            }
         })
			.catch(error => {
				onError(error);
			})
      },
      onRoleChanged(val) {
         this.onParamsChanged();
      },
      onPageChanged(page){
			this.params.page = page;
			this.onParamsChanged();
		},
		onPageSizeChanged(size){
			this.params.pageSize = size;
			this.onParamsChanged();
		},
		onParamsChanged() {
			this.fetchData(this.params);
		},
      search() {
         this.fetchData(this.params);
      },
      clearSearch() {
         this.params.keyword = '';
			this.onParamsChanged();
      }
   }
}
</script>

<style>

</style>