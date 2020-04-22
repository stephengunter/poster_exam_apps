<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td v-if="can_edit">
            <v-btn @click.prevent="edit(props.item.id)" flat icon color="success">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
         </td>
         <td>
            {{ props.item.id }}
         </td>
         <td>
            <div v-if="props.item.price" class="item-price">
               <span class="mr-1">$</span>
               <span class="price-number">{{ props.item.price }}</span>
            </div>
         </td>
         <td>
               <span>{{ props.item.discount }}</span>
               <span class="ml-1">%</span>
         </td>
         <td>
            {{ props.item.startDateText }}
         </td>
         <td>
            {{ props.item.endDateText }}
         </td>
         <td>
            <v-chip v-if="props.item.active" color="green" text-color="white">{{ props.item.statusText }}</v-chip>
            <v-chip v-else>{{ props.item.statusText }}</v-chip>
         </td>
         <td v-html="props.item.description">
           
         </td>
      </template>
   </v-data-table>
</template>

<script>

export default {
   name: 'PlansTable',
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
               value: '',
               width: '30px'
            },
            {
					sortable: false,
					text: 'Id',
               value: '',
               width: '30px'
            },
            {
					sortable: false,
					text: '金額',
               value: '',
               width: '120px'
            },
            {
					sortable: false,
					text: '折扣',
               value: '',
               width: '120px'
            },
            {
					sortable: false,
					text: '開始日期',
               value: '',
               width: '120px'
            },
            {
					sortable: false,
					text: '結束日期',
               value: '',
               width: '120px'
            },
            {
					sortable: false,
					text: '狀態',
               value: '',
               width: '120px'
            },
				{
					sortable: false,
					text: '說明',
               value: '',
               width: ''
				}
				
			]	
		}
   },
   beforeMount() {
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