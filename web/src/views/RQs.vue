<template>
   <v-container>
      <rq-header ref="rqHeader" :title="title"
      :init_params="params" :subjects="subjects"
      :mode_options="modeOptions" :year_options="yearOptions"
      @submit="onSelectionSubmit"
      />
      <div v-show="isReadMode">
         <rq-read ref="rqRead" :model="model" />
      </div>
      <div v-show="isExamMode">
         <exam-edit ref="examEdit" :exam="exam"
         @aborted="onExamAborted"
         /> 
      </div>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_RQS, SELECT_RQS_MODE, CREATE_EXAM,
STORE_EXAM, SAVE_EXAM, ABORT_EXAM 
} from '@/store/actions.type';
import { SET_APP_ACTIONS } from '@/store/mutations.type';

import { fetchActions, resolveErrorData, getRouteTitle,
  toCnNumber, todayString
} from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'RQsView',
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

         mode: '',
         actions: [],

         exam: null,

         confirm: {
            title: '',
            text: '',
            active: false,
            action: '',
				maxWidth: DIALOG_MAX_WIDTH
         }
		}
   },
   // beforeRouteLeave(to, from, next) {
   //    //檢查是否有未存檔的測驗
      
   //    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
   //    if (answer) {
   //       next()
   //    } else {
   //       next(false)
   //    }
   // },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
      ...mapState({
         model: state => state.rqs.model
		}),
      firstLoad() {
         return this.params.mode < 0;
      },
      isReadMode() {
         return this.mode === 'read'
      },
      isExamMode() {
         return this.mode === 'exam'
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

         this.exam = null;
         this.setMode(this.params.mode);

         if(this.$refs.rqHeader) this.$refs.rqHeader.init();

         let title = getRouteTitle(this.$route);
         this.title = title;
         this.fetchData(this.params);
         
         this.actions = fetchActions(this.$route.name);
      },
      onSelectionSubmit(params) {
         this.setMode(params.mode);
         this.params = { ... params };

         if(this.mode === 'read') this.fetchData(params);
         else if(this.mode === 'exam') this.createExam(params);         
      },
      setMode(val) {
         if(val === 0) this.mode = 'read';
         else if(val === 1) this.mode = 'exam';
         else this.mode = '';
      },
      fetchData(params) {
         this.$store.dispatch(FETCH_RQS, { mode: params.mode, recruit: params.subject })
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
            }
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      createExam(params) {
         this.exam = null;
         this.$store.dispatch(CREATE_EXAM, { recruit: params.subject })
         .then(exam => {
            this.exam = exam;
            let title =  `${this.$refs.rqHeader.getTitle()}_${todayString().replace(/-/g,'')}`;
            this.exam.title = title.replace(/\s/g,'').replace(/>/g,'_');
            this.setActions();
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
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
            this.$refs.examEdit.onStoreExam();
         }else if(name === SAVE_EXAM) {
            this.$refs.examEdit.onSaveExam();
         }else if(name === ABORT_EXAM) {
            this.$refs.examEdit.onAbortExam();
         }
      },
      onExamAborted() {
         this.init();
      }
      
	}
}
</script>