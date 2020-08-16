<template>
   <v-col cols="12">
      <v-badge v-if="model.totalQuestions" color="warning" style="margin:8px">
         <template v-slot:badge>
            <span>{{ model.totalQuestions }}</span>
         </template>
         <span style="font-size:1.2rem; font-weight: 500; margin:8px">{{ model.subject.title }}</span>
      </v-badge>
      <span v-else  style="font-size:1.2rem; font-weight: 500; margin:8px">{{ model.subject.title }}</span>
     
      <ul>
         <exam-settings-term v-for="(term, index) in model.termQuestions" :key="index"
         :model="term" :subject_type="subject_type"
         />
      </ul>
      
   </v-col>
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