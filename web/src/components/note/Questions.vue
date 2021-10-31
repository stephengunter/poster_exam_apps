<template>
   <v-card>
      <v-card-text v-if="pageList.length">
         <v-row>
            <v-col cols="6">
               <h3>相關試題</h3>
            </v-col>
            <v-col cols="6" class="text-right">
               <v-btn :color="showAnswers ? 'default' : 'success'" outlined @click.prevent="switchAnswers(!showAnswers)">
                  {{ showAnswers ? '隱藏答案' : '顯示答案'}}
               </v-btn>
            </v-col>
         </v-row>
         <div v-for="(page, index) in pageList" :key="index">
            <div v-show="page.pageNumber <= currentPage">
               <question-edit v-for="(question, question_index) in page.questions" :key="question_index"
               :show_recruits="true"
               :index="index * pageSize + question_index + 1" :read_only="page.showAnswers"
               :model="question" :element_id="`q_${question.index}`"
               @show-photo="onShowPhoto" 
               />
            </div>
         </div>
         <v-row>
            <v-col cols="6">
               
            </v-col>
            <v-col cols="6" class="text-right">
               
               <v-btn v-if="lastPage" :color="lastPage.showAnswers ? 'default' : 'success'" outlined @click.prevent="switchAnswers(!lastPage.showAnswers)">
                  {{ lastPage.showAnswers ? '隱藏答案' : '顯示答案'}}
               </v-btn>
               <v-btn v-show="currentPage < pageList.length" text class="ml-1" color="primary" @click.prevent="more">
                  更多題目..
               </v-btn>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>	
</template>

<script>
import { FETCH_QUESTIONS } from '@/store/actions.type';
import { onError, resolveErrorData, getRouteTitle } from '@/utils';
export default {
   name: 'NoteQuestions',
   props: {
      term_id: {
         type: Number,
         default: 0
      },
      subject_id: {
         type: Number,
         default: 0
		}
   },
   data() {
      return {
         currentPage: 1,
         pageSize: 10,
         pageList: [],
         showAnswers: false
      }
   },
   computed: {
      lastPage() {
         if(!this.pageList.length) return null;
         return this.pageList.find(item => item.pageNumber === this.currentPage);
      }
   },
   methods: {
      init() {
         this.pageList = [];
         this.currentPage = 1;
      },
      fetchData() {
         let pageSize = this.pageSize;
			this.$store.dispatch(FETCH_QUESTIONS, { term: this.term_id, subject: this.subject_id })
			.then(questions => {
				if(questions && questions.length) {
               // questions.sort((a, b) => {
               //    if(a.recruits.length === b.recruits.length) return a.id - b.id;
               //    else return a.recruits.length === b.recruits.length;
               // });

               let totalPages = Math.ceil(questions.length / pageSize);
               for(let i = 1; i <= totalPages; i++){
                  this.pageList.push({
                     pageNumber: i,
                     showAnswers: false,
                     questions: questions.slice((i - 1) * pageSize, i * pageSize)
                  });
               }
				}else {

				}
			})
			.catch(error => {
				Bus.$emit('errors', resolveErrorData(error));
			})
      },
      more() {
         this.currentPage += 1;
      },
      switchAnswers(val) {
         if(val) {
            //顯示答案
            let currentPage = this.currentPage;
            this.pageList.forEach(page => {
               if(page.pageNumber <= currentPage) page.showAnswers = true;
            })   
         }else {
            //隱藏答案
            this.pageList.forEach(page => {
               page.showAnswers = false;
            })
         }
         this.showAnswers = val;
      },
      onShowPhoto(photo) {
         this.$emit('show-photo', photo);
      }
   }
}
</script>

<style>

</style>