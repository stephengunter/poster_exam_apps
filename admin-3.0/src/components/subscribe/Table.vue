<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="(item, index) in items" :key="index">
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.user.userName }}
               </td>
               <td>
                  {{ item.startDateText }}
               </td>
               <td>
                  {{ item.endDateText }}
               </td>
               <td>
                  <v-chip v-if="item.active" small color="green" text-color="white">{{ item.statusText }}</v-chip>
                  <v-chip v-else small>{{ item.statusText }}</v-chip>
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>


<script>
import { mapGetters } from 'vuex';
export default {
	name: 'SubscribeTable',
	props: {
      list: {
         type: Array,
         default: () => []
      }
	},
	data () {
		return {
			headers: [
            {
					sortable: false,
					text: 'Id',
               value: 'id',
               width: '30px'
            },
            {
					sortable: false,
					text: 'UserName',
					value: 'userName',
               width: '120px'
            },
            {
					sortable: false,
					text: '開始日期',
               value: 'startDateText',
               width: '120px'
            },
            {
					sortable: false,
					text: '結束日期',
               value: 'endDateText',
               width: '120px'
            },
            {
					sortable: false,
					text: '狀態',
               value: 'status',
               width: '100px'
            }
				
			]	
		}
   },
	methods: {
        
	}
}
</script>
