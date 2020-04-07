<template>
   <v-data-table :items="results" :headers="headers"  hide-actions item-key="id">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <tr class="row-recruit" :key="props.item.id">
            <td> 
               <a href="#" @click.prevent="select(props.item.recruitId)">
               {{ props.item.recruit.parentTitle }}
               </a>
            </td>
            <td v-for="(subject, index) in subjects" :key="index">
              {{ getSummaryContent(props.item.summaryList, subject) }}
            </td>
            <td>
               {{ getTotal(props.item) }}
            </td>
         </tr>
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