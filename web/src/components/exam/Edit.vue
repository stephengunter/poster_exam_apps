<template>
<div>
   <v-card v-if="exam">
      <v-card-text>
         <exam-part v-for="(part, index) in parts" :key="index" 
         :model="part" :read_only="exam.isComplete"
         @show-photo="onShowPhoto"  @answer-changed="onAnswerChanged"
         />
      </v-card-text>
      <exam-actions :actions="actions"
      @action-selected="handleAction"
      />
   </v-card>

   <v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
      <photo-show :model="showPhoto.model" @cancel="showPhoto.active = false" />
   </v-dialog>
   
   <v-dialog v-model="save.active" :max-width="save.maxWidth" persistent>
      <exam-save v-if="save.active" :exam="exam" :on_ok="save.on_ok"
      @save="saveExam" @cancel="onSaveCanceled"
      />
   </v-dialog>

   

   <v-dialog v-model="summary.active" :max-width="summary.maxWidth">
      <exam-summary :model="exam" :doing="true"
      :has_answers="hasAnswers" :no_answers="noAnswers"
      :corrects="corrects" :wrongs="wrongs"
      @to-question="scrollToQuestion"
      @cancel="summary.active = false"
      >
         <exam-actions :actions="actions"
         @selected="summary.active = false"
         />
      </exam-summary>
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EXAM_SUMMARY, STORE_EXAM, SAVE_EXAM, 
   ABORT_EXAM, DELETE_EXAM, EXAM_RECORDS, LEAVE_EXAM,
   LOAD_EXAM_SUMMARY, SELECT_RQS_MODE, RQS_INDEX
} from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { showConfirm } from '@/utils';

export default {
   name: 'ExamEdit',
   props: {
      exam: {
         type: Object,
         default: null
      },
      actions: {
         type: Array,
         default: null
      }
   },
   data() {
		return {
         answerChangeds: 0,

         showPhoto: {
				active: false,
				model: null,
				maxWidth: DIALOG_MAX_WIDTH
         },

         save: {
            model: null,
            maxWidth: DIALOG_MAX_WIDTH,
            active: false,
            callback: null,
            on_ok: null
         },

         stored: false,

         summary: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
      ...mapState({
         examSummary: state => state.exams.summary
      }),
      hasAnswers() {
         return this.examSummary.hasAnswers
      },
      noAnswers() {
         return this.examSummary.noAnswers
      },
      corrects() {
         return this.examSummary.corrects
      },
      wrongs() {
         return this.examSummary.wrongs
      },
      parts() {
         if(this.exam) return this.exam.parts;
         return []; 
      },
      partQuestions() {
         if(this.exam) return this.exam.parts.map(item => ({ questions: item.questions }));
         return []; 
      }
   },
   methods: {
      init() {
         this.stored = false;
         this.$store.dispatch(LOAD_EXAM_SUMMARY);
      },
      onAnswerChanged() {
         this.answerChangeds += 1;
         this.$store.dispatch(LOAD_EXAM_SUMMARY);
      },
      onShowPhoto(photo) {
         this.showPhoto.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
      },
      onAbortExam() {
         showConfirm({
            type: '', 
            title: '確定要放棄此測驗嗎?',
            onOk: () => {
               this.abortExam();
            }
         });       
      },
      onDeleteExam() {
         showConfirm({
            type: 'error', 
            title: '確定要刪除此測驗嗎?',
            onOk: () => {
               this.abortExam();
            }
         });
      },
      abortExam(callback = null) {
         let id = this.exam.id;
         this.$store.dispatch(ABORT_EXAM, id)
         .then(() => {
            if(callback) callback();
            else this.$emit('aborted');
         })
			.catch(error => {
            Bus.$emit('errors', error);
			})
      },
      saveExam(callback = null) {
         if(!this.exam.reserved && !this.save.active) {
            //第一次存檔
            this.save = {
               model: { ... this.exam },
               maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH,
               active: true,
               on_ok: null,
               callback
            }
            return;
         }

         if(this.save.active) {
            this.save.active = false;
            callback = this.save.callback;
         }
         
         this.$store.dispatch(SAVE_EXAM, this.exam)
         .then(() => {
            this.exam.reserved = true;
            this.answerChangeds = 0;

            Bus.$emit('success');
            if(callback) callback();
            else this.$emit('saved');
         })
			.catch(error => {
            Bus.$emit('errors', error);
			})
      },
      onSaveCanceled() {
         //還原修改前資料
         this.exam.title = this.save.model.title;
         this.save = {
            model: null,
            maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH,
            active: false,
            callback: null
         };
      },
      onStoreExam() {
         if(this.stored) return;
         
         //檢查是否有空白未作答的題目
         if(this.noAnswers.length) {
            showConfirm({
               type: '', 
               title: `還有 ${this.noAnswers.length} 題沒有作答，是否確定要交券?`,
               onOk: () => {
                  this.storeExam();
               }
            });
            return;
         }else {
            //交券
            this.storeExam();
         }
      },
      storeExam() {
         let vm = this;
         if(!this.exam.reserved && !this.save.active) {
            //第一次存檔
            this.save = {
               model: { ... this.exam },
               maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH,
               active: true,
               on_ok: vm.storeExam,
               callback: null
            }
            return;
         }

         //將存檔視窗關閉
         if(this.save.active) this.save.active = false;
         
         this.$store.dispatch(STORE_EXAM, this.exam)
         .then(() => {
            this.stored = true;
            Bus.$emit('success');
            this.$emit('stored');
         })
			.catch(error => {
            Bus.$emit('errors', error);
			})
      },
      showSummary() {
         this.summary.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
         this.summary.active = true;
      },
      onLeaveExam(callback = null) {
         let vm = this;
         if(vm.exam.isComplete || vm.stored) {
            vm.leaveExam(callback);
         }else {
            if(vm.exam.reserved) {
               if(vm.answerChangeds) {
                  showConfirm({
                     type: '', 
                     title: '是否存檔', 
                     text: '此測驗有尚未儲存的變動，是否存檔?', 
                     ok: '存檔', 
                     cancel:  '不存檔',
                     onOk: () => {
                        vm.saveExam(() => {
                           vm.leaveExam(callback);
                        });
                     },
                     onCancel: () => {
                        vm.leaveExam(callback);
                     }
                  }); 
               }else {
                  vm.leaveExam(callback);
               }
            }else {
               showConfirm({
                  type: '', 
                  title: '是否存檔', 
                  text: '此測驗尚未存檔，是否存檔?', 
                  ok: '存檔', 
                  cancel:  '不存檔',
                  onOk: () => {
                     vm.saveExam(() => {
                        vm.leaveExam(callback);
                     });
                  },
                  onCancel: () => {
                     vm.abortExam(() => {
                        vm.leaveExam(callback);
                     });
                  }
               }); 
            }
            
         }
      },
      leaveExam(callback) {
         if(callback) callback();
         else this.$emit('leave');
      },
      handleAction(name, callback = null) {
         switch (name) {
            case EXAM_RECORDS:
            case RQS_INDEX:
            case SELECT_RQS_MODE:
            case LEAVE_EXAM:
               this.onLeaveExam(callback);
               break;
            case DELETE_EXAM:
               this.onDeleteExam();
               break;
            case STORE_EXAM:
               this.onStoreExam();
               break;
            case SAVE_EXAM:
               this.saveExam();
               break;
            case ABORT_EXAM:
               this.onAbortExam();
               break;
            case EXAM_SUMMARY:
               this.showSummary();
               break;
            default:
               console.log('name');
         }//end of switch
      },
      scrollToQuestion(index) {
         var element = document.getElementById(`e_${this.exam.id}_q_${index}`);
         if(!element) return;
         element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest'});
      }
   }
}
</script>

<style>

</style>