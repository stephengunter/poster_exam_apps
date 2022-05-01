<template>
   <v-data-table :headers="headers" :items="list" hide-default-footer :server-items-length="list ? list.length : 0">
      <template v-slot:item.dateTimeText="{ item }">
         <a href="#" class="a-btn" @click.prevent="select(item.id)">
            {{ item.dateTimeText }}
         </a>
      </template>
      <template v-slot:item.content="{ item }">
         
         <span v-if="responsive" class="d-inline-block text-truncate" style="max-width: 150px;">
               {{ item.content }}
            </span>
            <span v-else>
               {{ item.content }}
            </span>
      </template>
   </v-data-table>
</template>


<script>
import { mapGetters } from 'vuex';
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
               value: 'dateTimeText',
               width: '20%'
            },
            {
					sortable: false,
					text: 'Type',
               value: 'typeName',
               width: '30%'
            },
            {
					sortable: false,
					text: '內容',
               value: 'content',
            }
         ]
		}
   },
   computed: {
		...mapGetters(['responsive'])
	},
	methods: {
      select(id) {
         this.$emit('selected', id)
      }   
	}
}
</script>
