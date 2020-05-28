<template>
   <v-simple-table>
      <template v-slot:default>
      <thead>
         <tr>
            <th v-if="subject < 1">科目</th>
            <th>存檔名稱</th>
            <th v-if="status < 0">狀態</th>
            <th v-if="status > 0">得分</th>
            <th>最後更新</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(item, index) in list" :key="index" @click.prevent="select(item)">
            <td v-if="subject < 1">{{ item.subject.title }}</td>
            <td>{{ item.title }}</td>
            <td v-if="status < 0">
               <v-chip :outlined="!item.isComplete" small color="primary">
               {{ item.examStatusText }}
               </v-chip>
            </td>
            <td v-if="status > 0">
               <exam-score :score="item.score" />
            </td>
            <td>{{ item.lastUpdatedText }}</td>
         </tr>
      </tbody>
      </template>
   </v-simple-table>  
</template>

<script>
export default {
   props: {
      list: {
			type: Array,
			default: null
      },
      params: {
			type: Object,
			default: null
      }
   },
   data() {
		return {
         
		}
   },
   computed: {
      subject() {
         if(this.params) {
            return this.params.subject;
         }
         return 0; 
      },
      status() {
         if(this.params) {
            return this.params.status;
         }
         return -1; 
      }
   },
   methods: {
      select(item) {
         this.$emit('selected', item);
      }
   }
}
</script>

<style>

</style>