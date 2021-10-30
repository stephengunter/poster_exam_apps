<template>
<div>
   <v-card>
      <v-card-text>
         <exam-part v-for="(part, index) in parts" :key="index" 
         :model="part"
         @show-photo="onShowPhoto"
         />
      </v-card-text>
   </v-card>
   
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { EXAM_SUMMARY, STORE_EXAM, SAVE_EXAM, 
   ABORT_EXAM, DELETE_EXAM, EXAM_RECORDS, LEAVE_EXAM, SHOW_PHOTO,
   LOAD_EXAM_SUMMARY, SELECT_RQS_MODE
} from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { showConfirm } from '@/utils';

export default {
   name: 'ExamRead',
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

         summary: {
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
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
         this.$store.dispatch(LOAD_EXAM_SUMMARY);
      },
      onShowPhoto(photo) {
         Bus.$emit(SHOW_PHOTO, photo);
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
      showSummary() {
         this.summary.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
         this.summary.active = true;
      },
      handleAction(name, callback = null) {
          console.log('handleAction', name);
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