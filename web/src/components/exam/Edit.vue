<template>
<div>
   <v-card>
      <v-card-text>
         <exam-part v-for="(part, index) in parts" :key="index" 
         :model="part"
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
   
   <v-dialog v-model="save.active" :max-width="save.maxWidth">
      <core-confirmation :title="save.title" :text="save.text"
      @ok="saveExam" @cancel="save.active = false"
      >
         <exam-save :model="save.model" />
      </core-confirmation>
   </v-dialog>

   <v-dialog v-model="confirm.active" :max-width="confirm.maxWidth" persistent>
      <core-confirmation :title="confirm.title" :text="confirm.text"
      :ok_text="confirm.ok_text"  :cancel_text="confirm.cancel_text"
      :on_cancel="confirm.on_cancel"  :on_ok="confirm.on_ok"
      @ok="hideConfirm" @cancel="hideConfirm"
      />
   </v-dialog>

   <v-dialog v-model="summary.active" :max-width="summary.maxWidth">
      <exam-summary :model="exam" :doing="true"
      :has_answers="hasAnswers" :no_answers="noAnswers"
      @cancel="summary.active = false"
      />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EXAM_SUMMARY, STORE_EXAM, SAVE_EXAM, 
   ABORT_EXAM, DELETE_EXAM, EXAM_RECORDS, LEAVE_EXAM,
   LOAD_EXAM_SUMMARY, SELECT_RQS_MODE
} from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';

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

         confirm: {
            title: '',
            text: '',
            active: false,
            action: '',
            maxWidth: DIALOG_MAX_WIDTH,
            ok_text: '確定',
            cancel_text: '取消',
            on_ok: null,
            on_cancel: null
         },

         save: {
            title: '測驗存檔',
            text: '',
            model: '',
            active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },

         summary: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
      ...mapState({
			hasAnswers: state => state.exams.hasAnswers,
			noAnswers: state => state.exams.noAnswers
		}),
      parts() {
         if(this.exam) return this.exam.parts;
         return []; 
      },
      partQuestions() {
         if(this.exam) return this.exam.parts.map(item => ({ questions: item.questions }));
         return []; 
      },
      // questionCounts() {
      //    return this.partQuestions.map(item => item.questions.length);
      // },
      // totalQuestions() {
      //    return this.partQuestions.reduce((a, b) => a.questions.length + b.questions.length); 
      // }
   },
   methods: {
      init() {
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
        
         this.showConfirm({
            action: ABORT_EXAM, 
            title: '確定要放棄此測驗嗎',
            onOk: () => {
               this.abortExam();
            }
         });       
      },
      onDeleteExam() {

      },
      abortExam(callback = null) {
         let id = this.exam.id;
         this.$store.dispatch(ABORT_EXAM, id)
         .then(() => {
            if(callback) callback();
            else this.$emit('aborted');
         })
			.catch(error => {
            Bus.$emit('errors');
			})
      },
      onSaveExam() {
         if(this.exam.reserved) {
            this.saveExam();
         }else {
            //第一次存檔
            this.save.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
            this.save.model = { title: this.exam.title };
            this.save.active = true;
         }
      },
      saveExam(callback = null) {
         if(!this.exam.reserved) {
            //第一次存檔
            this.exam.title = this.save.model.title;
            this.save.active = false;
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
            Bus.$emit('errors');
			})
      },
      onStoreExam() {
         console.log('onStoreExam');
      },
      storeExam() {
         console.log('storeExam');
      },
      showSummary() {
         this.summary.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
         this.summary.active = true;
      },
      showConfirm({action, title, text, ok ='確定', cancel = '取消', onOk = null, onCancel = null}) {
         this.confirm = {
            action,
            title,
            text,
            ok_text: ok,
            cancel_text: cancel,
            maxWidth: this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH,
            active: true,
            on_ok: onOk,
            on_cancel: onCancel
         };
      },
      hideConfirm() {
         this.confirm = {
            action: '',
            title: '',
            text: '',
            ok_text: '確定',
            cancel_text: '取消',
            maxWidth: DIALOG_MAX_WIDTH,
            active: false,
            on_ok: null,
            on_cancel: null
         };
      },
      onLeaveExam(callback = null) {
         let vm = this;
         if(this.exam.isComplete) {
            this.leaveExam(callback);
         }else {
            if(this.exam.reserved) {
               if(this.answerChangeds) {
                  this.showConfirm({
                     action: SAVE_EXAM, 
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
                  this.leaveExam(callback);
               }
            }else {
               this.showConfirm({
                  action: SAVE_EXAM, 
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
               this.onSaveExam();
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
      }
   }
}
</script>

<style>

</style>