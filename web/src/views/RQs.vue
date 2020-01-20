<template>
   <v-container>
      <RQHeader ref="rqHeader" :title="title"
      :params="params" :subjects="subjects"
      :mode_options="modeOptions" :year_options="yearOptions"
      @submit="onSelectionSubmit"
      />
      <div v-if="isReadMode" >
         <v-card>
            <v-card-text>
               <RQPart v-for="(part, index) in parts" :key="index" 
               :model="part" :start_index="getStartIndex(index)"
               @show-photo="onShowPhoto" 
               />
            </v-card-text>
         </v-card>
      </div>
      <div v-if="isExamMode && exam">
         <v-card>
            <v-card-text>
               <ExamPart v-for="(part, index) in exam.parts" :key="index" 
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
                     <v-btn v-on="on" @click="storeExam" color="success">交券</v-btn>
                  </template>
                  <span>交券，計分與存檔</span>
               </v-tooltip>
            </v-card-actions>
         </v-card>
      </div>
      <v-dialog v-model="showPhoto.active" :max-width="showPhoto.maxWidth">
			<v-card v-if="showPhoto.model">
            <v-card-title>
               <v-spacer />
               <a href="#" @click.prevent="showPhoto.active = false" class="a-btn">
                  <v-icon>mdi-window-close</v-icon>
               </a>
            </v-card-title>
				<v-card-text>
               <span class="center-helper"></span>
					<v-img class="img-center" :src="showPhoto.model.id | photoIdUrl"
					 :max-width="showPhoto.model.width"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
      
      <v-dialog v-model="confirm.active" :max-width="confirm.maxWidth">
         <Confirmation :title="confirm.title" :text="confirm.text"
         @ok="confirmOk" @cancel="hideConfirm" />
      </v-dialog>
      
      <v-dialog v-model="save.active" :max-width="save.maxWidth">
         <v-card v-if="save.active">
            <v-card-title>
               測驗存檔
               <v-spacer />
               <a href="#" @click.prevent="save.active = false" class="a-btn">
                  <v-icon>mdi-window-close</v-icon>
               </a>
            </v-card-title>
            <v-card-text>
            <v-container>
               <v-row>
                  <v-col cols="12">
                     <v-textarea v-model="save.title" label="標題" outlined auto-grow
                     rows="2"
                     row-height="15"
                     />
                  </v-col>
               </v-row>
            </v-container>
            
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn @click="saveExam" color="success">
                  確定
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_RQS, SELECT_RQS_MODE, STORE_EXAM, SAVE_EXAM, ABORT_EXAM } from '@/store/actions.type';
import { SET_APP_ACTIONS } from '@/store/mutations.type';

import { fetchActions, resolveErrorData, getRouteTitle,
  toCnNumber, todayString
} from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

import RQHeader from '@/components/rq/Header';
import RQPart from '@/components/rq/Part';
import ExamPart from '@/components/exam/Part';
import Confirmation from '@/components/core/Confirmation';
export default {
   name: 'RQsView',
   components: {
      RQHeader,
      RQPart,
      ExamPart,
      Confirmation
   },
   data() {
		return {
         title: '',
         params: {
            mode: -1,
            year: 0,
            subject: 0
         },

         subjects: [],
         modeOptions: [],
         yearOptions: [],
         
         questionCounts: [],
         
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
            title: '',
            active: false,
				maxWidth: DIALOG_MAX_WIDTH
         },
         
         actions: []
		}
   },
   beforeRouteLeave(to, from, next) {
   //   alert('prevent route change');
   //   next(false);

      const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
      if (answer) {
         next()
      } else {
         next(false)
      }
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
      ...mapState({
         parts: state => state.rqs.parts,
         exam: state => state.rqs.exam
		}),
      firstLoad() {
         return this.params.mode < 0;
      },
      isReadMode() {
         return this.params.mode === 0;
      },
      isExamMode() {
         return this.params.mode === 1;
      }
   },
   created(){
		Bus.$on('action-selected', this.onActionSelected);
	},
	beforeMount() {
      this.init();
   },
	methods: {
      init() {
         this.params = {
            mode: -1,
            year: 0,
            subject: 0
         };

         if(this.$refs.rqHeader) this.$refs.rqHeader.init();

         let title = getRouteTitle(this.$route);
         this.title = title;
         this.fetchData();
         
         this.actions = fetchActions(this.$route.name);
      },
      onSelectionSubmit() {
         this.fetchData();
      },
      fetchData() {
         let params = {
            mode: this.params.mode,
            recruit: this.params.subject
         };
         
         this.$store.dispatch(FETCH_RQS, params)
         .then(model => {
            if(this.firstLoad) {
               this.modeOptions = model.modeOptions;
               this.yearOptions = model.yearOptions;
               this.subjects = model.subjects;
               
               this.$nextTick(() => {
                  this.$refs.rqHeader.load();
               })
            }else {
               this.setActions();
               this.questionCounts = model.parts.map(part => part.questions.length);
            }
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      getExamId() {
         if(this.exam) return this.exam.id;
         return 0;
      },
      setActions() {
         let types = [];
         let actions = [];
         if(this.isExamMode) {
            types = [ABORT_EXAM, SAVE_EXAM, STORE_EXAM];
         }else {
            types = [SELECT_RQS_MODE];
         }
         actions = this.actions.filter(item => types.includes(item.name));
         this.$store.commit(SET_APP_ACTIONS, actions);
         
      },
      onActionSelected(name) {
         if(name === SELECT_RQS_MODE) {
            this.$refs.rqHeader.selectMode();
         }else if(name === STORE_EXAM) {
            this.storeExam();
         }else if(name === SAVE_EXAM) {
            this.onSaveExam();
         }else if(name === ABORT_EXAM) {
            this.onAbortExam();
         }
      },
      getStartIndex(index) {
         if(index < 1) return 1;
         return this.questionCounts[index - 1] + 1;
      },
      onShowPhoto(photo) {
         this.showPhoto.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.showPhoto.model = photo;
			this.showPhoto.active = true;
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
      storeExam() {
         console.log('storeExam');
      },
      onSaveExam() {
         if(this.exam.title) this.saveExam();
         else {
            let title = `${this.$refs.rqHeader.getTitle()}_${todayString().replace(/-/g,'')}`;
            this.save.title = title;
            this.save.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
            this.save.active = true;
         }
      },
      saveExam() {
         if(!this.exam.title) this.exam.title = this.save.title;
         this.$store.dispatch(SAVE_EXAM, this.exam)
         .then(() => {
            Bus.$emit('success');
            this.save.title = '';
            this.save.active = false;
         })
			.catch(error => {
            Bus.$emit('errors');
			})
      },
      onAbortExam() {
         this.showConfirm(ABORT_EXAM, '確定要放棄此測驗嗎?', '');         
      },
      abortExam() {
         let id = this.getExamId();
         this.$store.dispatch(ABORT_EXAM, id)
         .then(() => {
            this.init();
         })
			.catch(error => {
            Bus.$emit('errors');
			})
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