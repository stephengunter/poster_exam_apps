<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <question-item v-for="(question, index) in model.questions" :key="index"
      :model="question" :element_id="`rq_q_${question.index}`"
      @show-photo="onShowPhoto" 
      />
   </div>
</template>

<script>
export default {
   name: 'RQPart',
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
   }
}
</script>

<style>

</style>