<template>
   <v-card v-if="model">
      <core-close-icon-button @close="cancel" />
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="6">
                  <core-label-text title="存檔名稱" :text="model.title" />
               </v-col>
               <v-col cols="6">
                  <core-label-text title="最後更新" :text="model.lastUpdatedText" />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <core-label-text title="科目" :text="model.subject.title" />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <core-label-text title="狀態" :text="getStatusText(model)" :html="true" />
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
      <v-card-actions>
         <v-btn @click="remove" color="error">刪除</v-btn>
         <v-spacer />
         <v-btn @click="edit" color="success">繼續作答</v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'ExamSummary',
   props: {
      model: {
			type: Object,
			default: null
      }
   },
   methods: {
      getStatusText(model) {
         if(model.isComplete) return model.examStatusText;
         else {
            let total = model.totalQuestions;
            let hasAnswers = model.hasAnswers;
            return `${model.examStatusText} <span class="ml-2">(共 ${total} 題 , 已答 ${hasAnswers} 題)</span>`
         }
      },
      cancel() {
         this.$emit('cancel');
      },
      edit() {
         this.$emit('edit', this.model);
      },
      remove() {
         this.$emit('remove');
      }
   }
}
</script>

<style>

</style>