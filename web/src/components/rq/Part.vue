<template>
   <div v-if="model">
      <v-row>
         <v-col cols="12">
            <h3> {{ model.title }} </h3>
         </v-col>
		</v-row>
      <question-item v-for="(question, index) in model.questions" :key="index"
      :order="index + start_index" :model="question"
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
      },
      start_index: {
         type: Number,
         default: 0
      },
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