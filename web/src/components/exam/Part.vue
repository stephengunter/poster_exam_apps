<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <QuestionEdit v-for="(question, index) in model.questions" :key="index"
      :model="question" :multi_answers="model.multiAnswers"
      :order="index + start_index" 
      @show-photo="onShowPhoto" 
      />
   </div>
</template>

<script>
import QuestionEdit from '@/components/question/Edit';
export default {
   name: 'ExamPart',
   components: {
      QuestionEdit
   },
   props: {
		model: {
         type: Object,
         default: null
      },
      start_index: {
         type: Number,
         default: 0
      },
   },
   // mounted() {
	// 	console.log(this.model);
	// },
   methods: {
      onShowPhoto(photo) {
         this.$emit('show-photo', photo);
		},
   }
}
</script>
