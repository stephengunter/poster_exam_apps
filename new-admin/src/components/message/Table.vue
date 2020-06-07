<template>
   <v-data-table :items="list" :headers="headers" hide-default-footer class="elevation-1">
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="(item, index) in items" :key="index">
               <td>
                  <v-btn @click.prevent="edit(item.id)" icon color="success">
                  <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
               </td>
               <td>
                  <v-chip v-if="item.returned" color="success" text-color="white">已回覆</v-chip>
                  <v-chip v-else>未回覆</v-chip>
               </td>
               <td>
                  {{ item.createdAtText }}
               </td>
               <td>
                  {{ item.email }}
               </td>
               <td>
                  {{ item.subject }}
               </td>
               <td>
                  {{ item.content }}
               </td>
            </tr>
         </tbody>
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
               width: '120px'
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
