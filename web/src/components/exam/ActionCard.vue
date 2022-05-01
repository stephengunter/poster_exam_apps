<template>
    <v-card v-if="exam">
      <core-close-icon-button @close="cancel" />
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="6">
                  <core-label-text title="已作答" text="32" />
               </v-col>
               <v-col cols="6">
                  <core-label-text title="未作答" text="28" />
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
      <v-card-actions>
         
         <v-tooltip top v-if="!exam.isComplete">
            <template v-slot:activator="{ on }">
               <v-btn v-on="on" color="info">存檔</v-btn>
            </template>
            <span>存檔，保留此試券，下次繼續</span>
         </v-tooltip>
         <v-spacer />
         <v-tooltip top v-if="!exam.isComplete">
            <template v-slot:activator="{ on }">
               <v-btn v-on="on" color="success">交券</v-btn>
            </template>
            <span>交券，計分與存檔</span>
         </v-tooltip>
      </v-card-actions>
   </v-card>
</template>

<script>
export default {
   name: 'ExamActionCard',
   props: {
      exam: {
			type: Object,
			default: null
      }
   },
   methods: {
      cancel() {
         this.$emit('cancel');
      },
      edit() {
         this.$emit('edit', this.exam);
      },
      remove() {
         this.$emit('remove');
      }
   }
}
</script>

<style>

</style>