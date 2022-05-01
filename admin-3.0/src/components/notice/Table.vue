<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:item.action="{ item }">
         <v-tooltip v-if="item.active" top>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on"
               @click.prevent="off(item.id)"
               >
						<v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
					</v-btn>
				</template>
				<span>下架</span>
			</v-tooltip>
         <v-btn v-else @click.prevent="edit(item.id)" icon color="success">
            <v-icon small>mdi-pencil</v-icon>
         </v-btn>
      </template>
      <template v-slot:item.top="{ item }">
         <v-chip small v-if="item.top" color="warning" text-color="white">置頂</v-chip>
      </template>
      <template v-slot:item.status="{ item }">
         <v-chip small v-if="item.active" color="success" text-color="white">{{ item.statusText }}</v-chip>
         <v-chip small v-else>{{ item.statusText }}</v-chip>
      </template>
      <template v-slot:item.content="{ item }">
         <p v-html="item.content"></p>
      </template>
   </v-data-table>
</template>


<script>
export default {
	name: 'NoticeTable',
	props: {
      list: {
         type: Array,
         default: null
      }
	},
	data () {
		return {
         headers: [{
            text: '', value: 'action', sortable: false, width: '30px'
         },{
            text: '', value: 'top', sortable: false, width: '60px'
         },{
            text: '狀態', value: 'status', sortable: false, width: '90px'
         },{
            text: '日期', value: 'lastUpdatedText', sortable: false, width: '120px'
         },{
            text: '主旨', value: 'title', sortable: false
         },{
            text: '內容', value: 'content', sortable: false
         }]
		}
   },
	methods: {
      edit(id){
         this.$emit('edit', id);
      },
      off(id) {
         this.$emit('off', id)
      }
	}
}
</script>
