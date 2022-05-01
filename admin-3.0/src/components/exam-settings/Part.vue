<template>
   <v-row style="font-size:16px; color: rgba(0,0,0,.87);">
      <v-col cols="12" style="font-size: 24px!important; line-height: 32px !important; font-weight: 400;">
         <span v-if="model.order">
           {{ `Part ${model.order}`}}
         </span>
         <span>
           {{ `題目數：${model.questions}` }}
         </span>
      </v-col>
      
      <exam-settings-subject v-for="(subject, index) in model.subjects" :key="index"
      :model="subject" :subject_type="subject_type"
      />
      
   </v-row>   
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