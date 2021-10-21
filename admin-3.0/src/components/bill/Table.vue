<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="(item, index) in items" :key="index">
               <td>
                  {{ item.id }}
               </td>
               <td v-if="show_plan">
                  {{ item.plan.name }}
               </td>
               <td>
                  {{ item.user.userName }}
               </td>
               <td>
                  {{ item.createdAtText }}
               </td>
               <td style="padding: 10px 16px;">
                  <div v-if="item.amount" class="item-amount">
                     <span class="mr-1">$</span>
                     <span class="amount-number">{{ item.amount }}</span>
                  </div>
               </td>
               <td v-if="payed">
                  <v-chip v-if="item.payed" @click.prevent="select(item.id)"  small color="green" text-color="white">{{ item.statusText }}</v-chip>
                  <v-chip v-else small @click.prevent="select(item.id)">{{ item.statusText }}</v-chip>
                  <span v-if="item.payed" class="ml-1">{{ item.payedDateText}}</span>
               </td>
               <td v-else>
                  {{ item.deadLineText }}
                  <v-chip v-if="item.expired" small>已過期</v-chip>
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>


<script>
export default {
	name: 'BillTable',
	props: {
      list: {
         type: Array,
         default: () => []
      },
      show_plan: {
         type: Boolean,
         default: false
      },
      payed: {
         type: Boolean,
         default: true
      }
	},
	data () {
		return {
			defaultHeaders:[
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
					text: '建檔日期',
               value: 'createdAt',
               width: '120px'
            },
            {
					sortable: false,
					text: '金額',
               value: 'amount',
               width: '100px'
            }
				
			]	
		}
   },
   computed: {
      headers() {
         let cols = this.defaultHeaders.slice(0);
         if(this.show_plan) {
            cols.splice(1, 0, {
               sortable: false,
					text: '方案',
					value: 'plan',
               width: '100px'
            });
         }

         if(this.payed) {
            return cols.concat([
               {
                  sortable: false,
                  text: '狀態',
                  value: 'status',
                  width: '200px'
               }
            ]);
         }
         else {
            return cols.concat([
               {
                  sortable: false,
                  text: '狀態',
                  value: 'status',
                  width: '100px'
               },
               {
                  sortable: false,
                  text: '有效期限',
                  value: 'deadLineText',
                  width: '120px'
               }
            ]);
         }
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
td {
   vertical-align: text-top;
}
.item-amount {
	color: #ee4d2d;
   font-weight: 400;	
}
.amount-number{
	font-size: 155%;
	max-width: 130px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
