<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <question-edit v-for="(question, index) in model.questions" :key="index"
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
