<template>
   <v-data-table :headers="headers" :items="list"
   :items-per-page="10" class="elevation-1"
   @click:row="onRowSelected"
   >
      <template v-slot:item.lastUpdated="{ item }">
        {{ item.lastUpdatedText }}
      </template>
      
      <template v-slot:no-data>
        查無資料
      </template>

   </v-data-table>
</template>

<script>
export default {
   props: {
      model: {
			type: Object,
			default: null
      },
      params: {
			type: Object,
			default: null
		}
   },
   data() {
		return {
         columns:[{
            subjects: [-1, 0],
            status: [-1, 0, 1],
            text: '科目',
            value: 'subject.title',
            sortable: false,
         },{
            subjects: [],
            status: [-1, 0, 1],
            text: '存檔名稱',
            value: 'title',
            sortable: false,
         },{
            subjects: [],
            status: [-1],
            text: '狀態',
            value: 'examStatusText',
            sortable: false,
         },{
            subjects: [],
            status: [-1, 0, 1],
            text: '最後更新',
            value: 'lastUpdated',
            sortable: true,
         }]
//          text: string
//   value: string
//   align?: 'start' | 'center' | 'end'
//   sortable?: boolean
//   filterable?: boolean
//   divider?: boolean
//   class?: string | string[]
//   width?: string | number
//   filter?: (value: any, search: string, item: any) => boolean
//   sort?: (a: any, b: any) => number
			
		}
   },
   computed: {
      list() {
         if(!this.model) return [];
         return this.model.viewList;
      },
      headers() {
         let subject = this.params.subject;
         let status = this.params.status;
         let items = this.columns.filter(item => !item.subjects.length || item.subjects.includes(subject))
                                 .filter(item => item.status.includes(status));
         return items.map(item => ({
            text: item.text, value: item.value, sortable: item.sortable, 
         }))
      },
      headerKeys() {
         return this.headers.map(item => item.value);
      }
   },
   methods: {
      onRowSelected(item) {
         this.$emit('selected', item);
      },
      hasKey(key) {
         return this.headerKeys.includes(key);
      }
   }
}
</script>

<style>

</style>