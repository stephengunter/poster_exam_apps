<template>
   <v-data-table :items="list" :headers="headers"  hide-actions item-key="index">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <td>
            <v-btn @click.prevent="edit(props.item.id)" flat icon color="success">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
         </td>
         <td>
            <v-chip v-if="props.item.returned" color="success" text-color="white">已回覆</v-chip>
            <v-chip v-else>未回覆</v-chip>
         </td>
         <td>
            {{ props.item.createdAtText }}
         </td>
         <td>
            {{ props.item.email }}
         </td>
         <td>
             {{ props.item.subject }}
         </td>
         <td>
            {{ props.item.content }}
         </td>  
      </template>
   </v-data-table>
</template>


<script>
export default {
	name: 'MessageTable',
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
					text: '',
               value: '',
               width: '30px'
            },
            {
					sortable: false,
					text: '',
               value: '',
               width: '75px'
            },
            {
					sortable: false,
					text: '日期',
               value: '',
               width: '100px'
            },
            {
					sortable: false,
					text: 'Email',
               value: '',
               width: '20%'
            },
            {
					sortable: false,
					text: '主旨',
               value: '',
               width: '20%'
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
      edit(id){
         this.$emit('edit', id);
      },
      select(item) {
         this.$emit('select', item)
      }   
	}
}
</script>
