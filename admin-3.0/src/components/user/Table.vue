<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:item.roles="{ item }">
         <v-chip v-for="(role, index) in roles(item)" :key="index" small
         :color="roleColor(role)" text-color="white"
         :class="{ 'ml-1' : index > 0 }"
         >
         {{ role }}
         </v-chip>
      </template>
   </v-data-table>
</template>

<script>
import { getRoleColor } from '@/utils';

export default {
   name: 'UserTable',
   props: {
		list: {
         type: Array,
         default: null
      },
      can_remove: {
         type: Boolean,
         default: false
      },
      can_edit: {
         type: Boolean,
         default: true
      }
   },
   data () {
		return {
			headers: [
            {
					sortable: false,
					text: 'Id',
					value: 'id'
            },
				{
					sortable: false,
					text: 'UserName',
					value: 'userName'
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
   methods: {
      roles(user) {
         return user.roles ? user.roles.split(',') : []
      },
      roleColor(role) {
         return getRoleColor(role);
      }
   }


}

</script>