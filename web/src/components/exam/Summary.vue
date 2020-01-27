<template>
   <v-card v-if="doing">
      <core-close-icon-button @close="cancel" />
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="12">
                  <p> 已作答：  <span v-text="has_answers.length"></span> </p>  
                  <a @click="toQuestion(eq.index)"   v-for="eq in has_answers" :key="eq.index" >
                     <v-btn class="mx-1 mb-1" fab depressed  small color="primary" >
                        {{ eq.index }}
                     </v-btn>
                  </a>
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <p> 未作答：  <span v-text="no_answers.length"></span> </p>
                  <a @click="toQuestion(eq.index)" v-for="eq in no_answers" :key="eq.index" >
                     <v-btn class="mx-1 mb-1" depressed  fab small >
                        {{ eq.index }}
                     </v-btn>
                  </a>
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
      <slot></slot>
   </v-card>
   <v-card v-else>
      <core-close-icon-button @close="cancel" />
      <v-card-text v-if="model" >
         <v-container>
            <v-row>
               <v-col cols="6">
                  <core-label-text title="存檔名稱" :text="model.title" >
                     <v-btn @click="edit" class="ml-2" fab  x-small color="info">
                        <v-icon>mdi-pencil</v-icon>
                     </v-btn>
                  </core-label-text>  
                  
               </v-col>
               <v-col cols="6">
                  <core-label-text title="最後更新" :text="model.lastUpdatedText" />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <core-label-text title="科目" :text="model.subject.title" />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <core-label-text title="狀態" :text="getStatusText(model)" :html="true" />
               </v-col>
            </v-row>
            <v-row v-if="model.isComplete">
               <v-col cols="12">
                  <core-label-text title="得分">
                     <exam-score :score="model.score" />
                  </core-label-text>
               </v-col>
            </v-row>
         </v-container>
      </v-card-text>
      <slot></slot>
      
   </v-card>
</template>

<script>
export default {
   name: 'ExamSummary',
   props: {
      model: {
			type: Object,
			default: null
      },
      doing: {
         type: Boolean,
			default: false
      },
      has_answers: {
         type: Array,
			default: null
      },
      no_answers: {
         type: Array,
			default: null
      }
   },
   methods: {
      toQuestion(index) {
         
         this.$emit('cancel');
         this.$emit('to-question', index);
      },
      getStatusText(model) {
         if(model.isComplete) return model.examStatusText;
         else {
            let hasAnswers = model.hasAnswers;
            let total = hasAnswers.length + model.noAnswers.length;
           
            return `${model.examStatusText} <span class="ml-2">(共 ${total} 題 , 已答 ${hasAnswers.length} 題)</span>`
         }
      },
      cancel() {
         this.$emit('cancel');
      },
      edit() {
         this.$emit('edit');
      },
      remove() {
         this.$emit('remove');
      }
   }
}
</script>

<style>

</style>