<template>
   <v-container>
      <v-row>
         <v-col cols="12">
            <v-textarea v-model="model.title" label="標題" outlined auto-grow
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
      model: {
         type: Object,
         default: null
      }
   }
}
</script>