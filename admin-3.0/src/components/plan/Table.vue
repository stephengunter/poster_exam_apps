<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:body="{ items }">
         <tbody>
            <tr class="row-note" v-for="(item, index) in items" :key="index">
               <td>
                  <v-btn v-if="can_edit" @click.prevent="edit(item.id)" icon color="success">
                     <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
               </td>
               <td>
                  {{ item.id }}
               </td>
               <td>
                  {{ item.name }}
               </td>
               <td style="padding: 10px 16px;">
                  <div v-if="item.price" class="item-price">
                     <span class="mr-1">$</span>
                     <span class="price-number">{{ item.price }}</span>
                  </div>
               </td>
               <td>
                  <span>{{ item.discount }}</span>
                  <span class="ml-1">%</span>
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
               <td>
                  <p v-html="item.description"></p>
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>

<script>

export default {
   name: 'PlanTable',
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
					text: '',
               value: 'action',
               width: '30px'
            },
            {
					sortable: false,
					text: 'Id',
               value: 'id',
               width: '30px'
            },
            {
					sortable: false,
					text: '名稱',
               value: 'name',
               width: '120px'
            },
            {
					sortable: false,
					text: '金額',
               value: 'price',
               width: '120px'
            },
            {
					sortable: false,
					text: '折扣',
               value: 'discount',
               width: '60px'
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
               width: '120px'
            },
				{
					sortable: false,
					text: '說明',
               value: 'description'
				}
				
			]	
		}
   },
   methods: {
      remove(id) {
         this.$emit('remove', id);
      },
      edit(id){
         this.$emit('edit', id);
      }
   }


}

</script>

<style scoped>
td {
   vertical-align: text-top;
}
.item-price {
	color: #ee4d2d;
   font-weight: 400;	
}
.price-number{
	font-size: 155%;
	max-width: 130px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>