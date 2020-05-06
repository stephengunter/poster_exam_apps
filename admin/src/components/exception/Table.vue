<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="index">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td>
            {{ props.item.dateTimeText }}
         </td>
         <td>
             {{ props.item.typeName }}
         </td>
         <td>
             {{ props.item.content }}
         </td>
      </template>
   </v-data-table>
</template>


<script>
export default {
	name: 'ExceptionTable',
	props: {
      list: {
         type: Array,
         default: null
      }
	},
	data () {
		return {
			headers: [
            {
					sortable: false,
					text: '日期',
               value: '',
               width: '20%'
            },
            {
					sortable: false,
					text: 'Type',
               value: '',
                width: '30%'
            },
            {
					sortable: false,
					text: '內容',
               value: '',
            }
         ]
		}
   },
	methods: {
      select(item) {
         this.$emit('select', item)
      }   
	}
}
</script>
