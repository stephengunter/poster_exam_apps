<template>
<div>
   <v-data-table :headers="headers" :items="list"
   :server-items-length="totalItems" :options.sync="options"
   :items-per-page="10" class="elevation-1"
   :footer-props="{
      'items-per-page-all-text': '全部',
      'items-per-page-text' : '單頁資料數',
      'show-current-page': true
   }"
   @click:row="onRowSelected"
   >
      <template v-slot:item.isComplete="{ item }">
         <v-chip :outlined="!item.isComplete" small color="primary">
           {{ item.examStatusText }}
         </v-chip>
        
      </template>
      <template v-slot:item.score="{ item }">
        <exam-score :score="item.score" />
      </template>
      <template v-slot:item.lastUpdated="{ item }">
        {{ item.lastUpdatedText }}
      </template>
      <template v-slot:no-data>
        查無資料
      </template>

   </v-data-table>
</div>   
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
         loading: false,
         options: {},

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
            value: 'isComplete',
            sortable: false,
         },{
            subjects: [],
            status: [1],
            text: '得分',
            value: 'score',
            sortable: true,
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
      totalItems() {
         if(!this.model) return 0;
         return this.model.totalItems;
      },
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
   watch: {
      options: {
        handler () {
           console.log('options', this.options);
         //  this.getDataFromApi()
         //    .then(data => {
         //      this.desserts = data.items
         //      this.totalDesserts = data.total
         //    })
        },
        deep: true,
      },
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