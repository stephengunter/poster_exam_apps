<template>
<div>
   <v-card v-if="exam">
      <v-card-text>
         <exam-part v-for="(part, index) in exam.parts" :key="index" 
         :model="part" :start_index="getStartIndex(index)"
         @show-photo="onShowPhoto" 
         />
      </v-card-text>
      <v-card-actions>
         <v-tooltip top>
            <template v-slot:activator="{ on }">
               <v-btn v-on="on" @click="onAbortExam" class="mr-2">放棄</v-btn>
            </template>
            <span>放棄，不存檔</span>
         </v-tooltip>
         <v-tooltip top>
            <template v-slot:activator="{ on }">
               <v-btn v-on="on" @click="onSaveExam" color="info">存檔</v-btn>
            </template>
            <span>存檔，保留此試券，下次繼續</span>
         </v-tooltip>
         
         <v-spacer></v-spacer>
         <v-tooltip top>
            <template v-slot:activator="{ on }">
               <v-btn v-on="on" @click="onStoreExam" color="success">交券</v-btn>
            </template>
            <span>交券，計分與存檔</span>
         </v-tooltip>
      </v-card-actions>
   </v-card>

   <v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
      <photo-show :model="showPhoto.model" @cancel="showPhoto.active = false" />
   </v-dialog>
   
   <v-dialog v-model="save.active" :max-width="save.maxWidth">
      <core-confirmation :title="save.title" :text="save.text"
      @ok="saveExam" @cancel="save.active = dalse"
      >
         <exam-save :model="save.model" />
      </core-confirmation>
   </v-dialog>

   <v-dialog v-model="confirm.active" :max-width="confirm.maxWidth">
      <core-confirmation :title="confirm.title" :text="confirm.text"
      @ok="confirmOk" @cancel="hideConfirm"
      />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { STORE_EXAM, SAVE_EXAM, ABORT_EXAM } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'ExamEdit',
   props: {
      exam: {
         type: Object,
         default: null
      }
   },
   data() {
		return {
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
				maxWidth: DIALOG_MAX_WIDTH
         },

         save: {
            title: '測驗存檔',
            text: '',
            model: '',
            active: false,
				maxWidth: DIALOG_MAX_WIDTH
         }
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
      questionCounts() {
         if(this.exam) return this.exam.parts.map(part => part.questions.length);
         return [];         
      }
   },
   methods: {
      getStartIndex(index) {
         if(index < 1) return 1;
         return this.questionCounts[index - 1] + 1;
      },
      onShowPhoto(photo) {
         this.showPhoto.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
      },
      onAbortExam() {
         this.showConfirm(ABORT_EXAM, '確定要放棄此測驗嗎?', '');         
      },
      abortExam() {
         let id = this.exam.id;
         this.$store.dispatch(ABORT_EXAM, id)
         .then(() => {
            this.$emit('aborted');
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
      saveExam() {
         if(!this.exam.reserved) {
            //第一次存檔
            this.exam.title = this.save.model.title;
            this.save.active = false;
         }
         
         this.$store.dispatch(SAVE_EXAM, this.exam)
         .then(() => {
            this.exam.reserved = true;
            Bus.$emit('success');
            this.$emit('saved');
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
      showConfirm(action, title, text) {
         this.confirm.action = action;
         this.confirm.title = title;
         this.confirm.text = text;

         this.confirm.active = true;
      },
      hideConfirm() {
         this.confirm.action = '';
         this.confirm.title = '';
         this.confirm.text = '';

         this.confirm.active = false;
      },
      confirmOk() {
         let action = this.confirm.action;
         if(action === ABORT_EXAM) {
            this.abortExam();
         }
         this.hideConfirm();
      }
   }
}
</script>

<style>

</style>