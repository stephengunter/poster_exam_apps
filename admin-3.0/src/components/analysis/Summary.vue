<template>
   <v-data-table :items="results" :headers="headers"  hide-default-header hide-default-footer>
      <template v-slot:header="{ props: { headers } }">
         <thead>
            <tr>
               <core-th v-for="(header, index) in headers" :key="index">
                  {{ header.text }}
               </core-th>
            </tr>
         </thead>
      </template>
      <template v-slot:body="{ items }">
         <tbody>
            <tr v-for="(item, index) in items" :key="index">
               <td> 
                  <a href="#" class="a-btn" @click.prevent="select(item.recruitId)">
                  {{ item.recruit.parentTitle }}
                  </a>
               </td>
               <td v-for="(subject, index) in subjects" :key="index">
                  {{ getSummaryContent(item.summaryList, subject) }}
               </td>
               <td>
                  {{ getTotal(item) }}
               </td>
            </tr>
         </tbody>
      </template>
   </v-data-table>
</template>

<script>
export default {
   name: 'AnalysisRQ',
   props: {
      results: {
         type: Array,
         default: null
      },
      version: {
         type: Number,
         default: 0
      }
   },
   data () {
		return {
         headers: [],
         subjects: [],
		}
   },
   watch: {
      version: 'init'
   },
   methods: {
      init() {
         let subjects = [];
         let summaryList = this.results.flatMap(item => item.summaryList);
       
         summaryList.forEach(summary => {
            let idx = subjects.findIndex(item => item.id === summary.subjectId);
            if(idx < 0) subjects.push({ ...summary.subject });
         });
         let headers = subjects.map(item => ({
            sortable: false, text: item.title
         }));
        

         headers.push({ sortable: false, text: 'Total' });
         headers.unshift({ sortable: false, text: '' });

         
         this.headers = headers;
         this.subjects = subjects;
      },
      getSummaryContent(summaryList, subject) {
         let summary = summaryList.find(item => item.subjectId === subject.id);
         
         if(summary) return summary.points;
         else return '';
      },
      getTotal(item) {
         let total = 0;
         for(let i = 0; i < item.summaryList.length; i++) {
            total += item.summaryList[i].points;
         }
         return total;
      },
      select(id) {
         this.$emit('selected', id);
      }
   }
}
</script>