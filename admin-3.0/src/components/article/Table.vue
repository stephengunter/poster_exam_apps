<template>
<v-data-table :items="list" :headers="headers" :server-items-length="list ? list.length : 0"
   hide-default-footer item-key="index"
   >
      <template v-slot:body="{ items }">
         <tbody>
            <tr class="row-article" v-for="(item, index) in items" :key="index" >
               <td>
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
               </td>
               <td>
                  {{ item.id }}
               </td>
               <td>
                  <v-chip small v-if="item.active" color="success" text-color="white">{{ item.statusText }}</v-chip>
                  <v-chip small v-else>{{ item.statusText }}</v-chip>
               </td>
               <td>
                  {{ item.lastUpdatedText }}
               </td>
               <td>
                  {{ item.title }}
               </td>
               <td v-if="item.summary" v-html="item.summary">
                  
               </td>
               <td v-else>
                  {{ item.content | summary(150) }}
               </td>
            </tr>
         </tbody>
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
					text: '狀態',
               value: 'status',
               width: '90px'
            },
            {
					sortable: false,
					text: '日期',
               value: 'lastUpdatedText',
               width: '120px'
            },
            {
					sortable: false,
					text: '標題',
               value: 'title',
               width: '35%'
            },
            {
					sortable: false,
					text: '摘要',
               value: 'summary'
            }
         ]
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
