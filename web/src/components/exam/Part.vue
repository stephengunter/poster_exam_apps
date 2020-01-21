<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <question-edit v-for="(question, index) in model.questions" :key="index"
      :model="question" :multi_answers="model.multiAnswers"
      :order="index + start_index" 
      @show-photo="onShowPhoto" 
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
