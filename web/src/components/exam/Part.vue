<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <question-edit v-for="(question, index) in model.questions" :key="index"
      :exam_id="model.examId" :read_only="read_only"
      :element_id="`e_${model.examId}_q_${question.index}`"
      :model="question" :multi_answers="model.multiAnswers"
      @show-photo="onShowPhoto" @answer-changed="onAnswerChanged"
      />
   </div>
</template>

<script>
export default {
   name: 'ExamPart',
   props: {
		model: {
         type: Object,
         default: null
      },
      read_only: {
         type: Boolean,
         default: false
		}
   },
   
   methods: {
      onShowPhoto(photo) {
         this.$emit('show-photo', photo);
      },
      onAnswerChanged() {
         this.$emit('answer-changed');
      }
   }
}
</script>
