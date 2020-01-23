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
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
         @aborted="onExamAborted"
         /> 
      </div>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOAD_ACTIONS, ACTION_SELECTED, EXAM_SUMMARY,
   FETCH_RQS, SELECT_RQS_MODE, CREATE_EXAM,
   STORE_EXAM, SAVE_EXAM, ABORT_EXAM 
} from '@/store/actions.type';
import { SET_APP_ACTIONS } from '@/store/mutations.type';

import { examActions, resolveErrorData,
  getRouteTitle,todayString
} from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'RQsView',
   data() {
		return {
         title: '',
         mode: null,
         modeOptions: [],

         params: {
            mode: -1,
            year: 0,
            subject: 0
         },

         subjects: [],
         yearOptions: [],

         actions: [],

         exam: null,
         examActions: [],

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
         return this.mode && this.mode.value === 0;
      },
      isExamMode() {
         return this.mode && this.mode.value === 1;
      }
   },
   created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
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
      },
      onSelectionSubmit(params) {
         this.setMode(params.mode);
         this.params = { ... params };

         if(this.isReadMode) this.fetchData(params);
         else if(this.isExamMode) this.createExam(params);       
      },
      setMode(val) {
         this.mode = this.modeOptions.find(item => item.value === val);
         this.setActions();
      },
      fetchData(params) {
         this.$store.dispatch(FETCH_RQS, { mode: params.mode, recruit: params.subject })
         .then(model => {
            if(this.firstLoad) {
               this.modeOptions = model.modeOptions;
               this.yearOptions = model.yearOptions;
               this.subjects = model.subjects;

               this.setMode(model.modeOptions[0].value);
               
               this.$nextTick(() => {
                  this.$refs.rqHeader.load();
               })
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
            let bread =  this.$refs.rqHeader.getBread();
            let items = bread.items.slice(2);
            let title = `${items.join('_')}_${todayString().replace(/-/g,'')}`;
            exam.title = title;
            
            this.setExam(exam);
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      setExam(exam) {
			this.exam = exam ? exam : null;
			if(exam) {
				this.exam = exam;
            this.examActions = examActions(exam);

            this.setActions();

				this.$nextTick(() => {
            	this.$refs.examEdit.init();
         	})
			}else {
				this.exam = null;
			}
		},
      setActions() {
         let blocks = [];
         let types = [];
         if(this.isReadMode) {
            types = [SELECT_RQS_MODE];
            blocks.push(types);
         }else if(this.isExamMode) {
            if(!this.exam) return;
				blocks.push([SELECT_RQS_MODE, EXAM_SUMMARY]);
				blocks.push(this.examActions.map(item => item.name));
         }

         this.$store.dispatch(LOAD_ACTIONS, blocks);
      },
      onActionSelected(name) {
         if(name === SELECT_RQS_MODE) {
            this.$refs.rqHeader.selectMode();            
         }else {
            if(this.isExamMode) {
               this.$refs.examEdit.handleAction(name);
            }
         }
      },
      onExamAborted() {
         this.init();
      }
      
	}
}
</script>