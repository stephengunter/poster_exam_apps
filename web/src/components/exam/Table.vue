<template>
<div v-if="model">
   <v-data-table :headers="headers" :items="list"
   :server-items-length="totalItems" :options.sync="options"
   :footer-props="{
      'items-per-page-all-text': '全部',
      'items-per-page-text' : '單頁資料數',
      'show-current-page': true,
      'items-per-page-options' : pageSizeOptions,
      options: options
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
         options: {
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
            groupBy: [],
            groupDesc: [],
            multiSort: false,
            mustSort: false
         },

         pageSizeOptions: [5, 10, 25, -1],

         columns:[{
            subjects: [-1, 0],
            status: [-1, 0, 1],
            text: '科目',
            value: 'subject.title',
            sortable: false,
            width: ''
         },{
            subjects: [],
            status: [-1, 0, 1],
            text: '存檔名稱',
            value: 'title',
            sortable: false,
            width: ''
         },{
            subjects: [],
            status: [-1],
            text: '狀態',
            value: 'isComplete',
            sortable: false,
            width: ''
         },{
            subjects: [],
            status: [1],
            text: '得分',
            value: 'score',
            sortable: true,
            width: '75'
         },{
            subjects: [],
            status: [-1, 0, 1],
            text: '最後更新',
            value: 'lastUpdated',
            sortable: true,
            width: ''
         }]
			
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
            text: item.text, value: item.value, sortable: item.sortable, width: item.width
         }))
      },
      headerKeys() {
         return this.headers.map(item => item.value);
      }
   },
   watch: {
      options: {
        handler (val) {
            this.$emit('options-changed', {
               page: val.page,
               pageSize: val.itemsPerPage,
               sortBy: val.sortBy[0] ? val.sortBy[0] : '',
               desc: val.sortDesc[0] ? val.sortDesc[0] : false
            });
        },
        deep: true,
      },
   },
   methods: {
      init() {
         let pageSize = this.pageSizeOptions.includes(this.params.pageSize) ? this.params.pageSize : -1;
       
         this.options = {
            page: this.params.page < 1 ? 1 : this.params.page,
            itemsPerPage: pageSize,
            sortBy: [this.params.sortBy],
            sortDesc: [this.params.desc],
            groupBy: [],
            groupDesc: [],
            multiSort: false,
            mustSort: false
         };
      },
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