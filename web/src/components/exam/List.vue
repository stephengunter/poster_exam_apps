<template>
   <v-list class="list-text">
      <v-list-item v-for="(item, index) in list" :key="index" @click.prevent="select(item)">
         <v-list-item-content>
            <v-row v-if="subject < 1" dense>
               <v-col cols="3" class="item-header">
                  科目
               </v-col>
               <v-col cols="9" class="item-text">
                     {{ item.subject.title }}
               </v-col>
            </v-row>
            <v-row dense>
               <v-col cols="3" class="item-header">
                  存檔名稱
               </v-col>
               <v-col cols="9" class="item-text">
                  {{ item.title }}
               </v-col>
            </v-row>
            <v-row v-if="status < 0" dense>
               <v-col cols="3" class="item-header">
                  狀態
               </v-col>
               <v-col cols="9" class="item-text">
                  <v-chip :outlined="!item.isComplete" small color="primary">
                  {{ item.examStatusText }}
                  </v-chip>
               </v-col>
            </v-row>
            <v-row v-if="status > 0" dense>
               <v-col cols="3" class="item-header">
                  得分
               </v-col>
               <v-col cols="9" class="item-text">
                  <exam-score :score="item.score" />
               </v-col>
            </v-row>
            <v-row dense>
               <v-col cols="3" class="item-header">
                  最後更新
               </v-col>
               <v-col cols="9" class="item-text">
                  {{ item.lastUpdatedText }}
               </v-col>
            </v-row>
            <v-row dense v-if="index + 1 < list.length" :key="index">
               <v-divider class="mt-3" />
            </v-row>
         </v-list-item-content>
         
      </v-list-item>
   </v-list>
</template>

<script>
export default {
   name: 'ExamList',
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

<style scoped>
.list-text {
   font-size: 0.875rem;
}
.item-header {
   font-weight: 600;
}
.item-text {
   text-align: right;
}
</style>