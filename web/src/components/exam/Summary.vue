<template>
   <v-card v-if="model">
      <close-icon-button @close="cancel" />
      <v-card-text>
         <v-row>
            <v-col cols="6">
               <LabelText title="存檔名稱" :text="model.title" />
            </v-col>
            <v-col cols="6">
               <LabelText title="最後更新" :text="model.lastUpdatedText" />
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12">
               <LabelText title="科目" :text="model.subject.title" />
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12">
               <LabelText title="狀態" :text="getStatusText(model)" :html="true" />
            </v-col>
         </v-row>
      </v-card-text>
      <v-card-actions>
         <v-btn @click="remove" color="error">刪除</v-btn>
         <v-spacer />
         <v-btn @click="edit" color="success">繼續作答</v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import CloseIconButton from '@/components/core/CloseIconButton';
import LabelText from '@/components/core/LabelAndText';
export default {
   name: 'ExamSummary',
   components: {
      'close-icon-button' : CloseIconButton,
		LabelText
	},
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
         this.$emit('edit');
      },
      remove() {
         this.$emit('remove');
      }
   }
}
</script>

<style>

</style>