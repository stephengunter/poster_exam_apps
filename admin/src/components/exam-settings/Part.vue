<template>
<v-layout wrap>
   <v-flex xs12>
     <span class="headline">{{ `Part ${model.order}`}} {{ `題目數：${model.questions}` }}</span>
   </v-flex>
   
   <exam-settings-subject v-for="(subject, index) in model.subjects" :key="index"
   :model="subject" :subject_type="subject_type"
   />
   
</v-layout>   
</template>

<script>
export default {
   props: {
      model: {
         type: Object,
         default: null
      },
      subject_type: {
         type: String,
         default: ''
      }

   }
}
</script>