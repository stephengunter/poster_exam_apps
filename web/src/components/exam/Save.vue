<template>
   <v-container v-if="exam">
      <v-row>
         <v-col cols="12">
            <v-textarea v-model="exam.title" label="存檔名稱" outlined auto-grow
            rows="2"
            row-height="15"
            />
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
export default {
   name: 'ExamSave',
   props: {
      exam: {
         type: Object,
         default: null
      }
   }
}
</script>