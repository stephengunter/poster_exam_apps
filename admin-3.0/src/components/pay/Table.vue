<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="(item, index) in items" :key="index">
               <td>
                  <a class="a-btn" href="#" @click.prevent="select(item.id)">{{ item.id }}</a>
                  
               </td>
               <td>
                  {{ item.createdAtText }}
               </td>
               <td>
                  {{ item.billId }}
               </td>
               <td>
                  {{ item.payWay }}
               </td>
               <td style="padding: 10px 16px;">
                  <div v-if="item.money" class="item-money">
                     <span class="mr-1">$</span>
                     <span class="money-number">{{ item.money }}</span>
                  </div>
                  <span v-else>
                    {{ item.money }}
                  </span>

                  <span class="ml-1">{{ item.payedDateText}}</span>
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>


<script>
import { mapGetters } from 'vuex';
export default {
	name: 'PayTable',
	props: {
      list: {
         type: Array,
         default: () => []
      }
	},
	data () {
		return {
			headers:[
            {
					sortable: false,
					text: 'Id',
               value: 'id',
               width: '30px'
            },
            {
					sortable: false,
					text: '建檔日期',
               value: 'createdAt',
               width: '120px'
            },
            {
					sortable: false,
					text: 'BillId',
               value: 'billId',
               width: '30px'
            },
            {
					sortable: false,
					text: '支付方式',
               value: 'payWay',
               width: '100px'
            },
            {
					sortable: false,
					text: '金額',
               value: 'money',
               width: '100px'
            }
				
			]	
		}
   },
	methods: {
      select(id) {
         this.$emit('selected', id);
      }
	}
}
</script>



<style scoped>
.item-money {
	color: #ee4d2d;
   font-weight: 400;	
}
.money-number{
	font-size: 125%;
	max-width: 100px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
