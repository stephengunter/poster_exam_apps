<template>
   <v-container>
      <rq-header ref="rqHeader" :title="title"
      :init_params="params" :subjects="subjects"
      :mode_options="modeOptions" :year_options="yearOptions"
      @submit="onSelectionSubmit"
      />
      <div v-show="rqReadMode">
         <rq-read ref="rqRead" :model="model" />
      </div>
      <div v-show="rqExamMode">
         <exam-edit ref="examEdit" :exam="exam" :actions="examActions"
         @aborted="onExamAborted"
         /> 
      </div>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import {
   LOAD_ACTIONS, ACTION_SELECTED, EXAM_SUMMARY,
   FETCH_RQS, SELECT_RQS_MODE, CREATE_EXAM,
   STORE_EXAM, SAVE_EXAM, ABORT_EXAM 
} from '@/store/actions.type';
import { SET_RQS_PAGE_MODE, SET_APP_ACTIONS, SET_EXAM_TITLE } from '@/store/mutations.type';

import { resolveErrorData, getRouteTitle, todayString } from '@/utils';
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

         actions: [],

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
      ...mapGetters(['exam', 'rqReadMode', 'rqExamMode', 
		'responsive','contentMaxWidth','isAuthenticated'
		]),
      ...mapState({
         mode: state => state.rqs.mode,
         modeOptions: state => state.rqs.modeOptions,
         yearOptions: state => state.rqs.yearOptions,
         subjects: state => state.rqs.subjects,
         model: state => state.rqs.model,
         examActions: state => state.exams.actions
		}),
      firstLoad() {
         return this.params.mode < 0;
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

         if(this.$refs.rqHeader) this.$refs.rqHeader.init();

         let title = getRouteTitle(this.$route);
         this.title = title;
         
         this.fetchData(this.params);
      },
      onSelectionSubmit(params) {
         this.params = { ... params };
         this.setMode(params.mode);         
      },
      setMode(val) {
         this.$store.commit(SET_RQS_PAGE_MODE, val);
         this.$nextTick(() => {
				if(this.rqReadMode) this.fetchData(this.params);
            else if(this.rqExamMode) this.createExam(this.params);  

				this.setActions();
         })
      },
      fetchData(params) {
         this.$store.dispatch(FETCH_RQS, { mode: params.mode, recruit: params.subject })
         .then(model => {
            if(this.firstLoad) {
               this.$store.commit(SET_RQS_PAGE_MODE); 

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
         this.$store.dispatch(CREATE_EXAM, { recruit: params.subject })
         .then(exam => {
            let bread =  this.$refs.rqHeader.getBread();
            let items = bread.items.slice(2);
            let title = `${items.join('_')}_${todayString().replace(/-/g,'')}`;
           
            this.$store.commit(SET_EXAM_TITLE, title);
            this.$nextTick(() => {
               this.setActions();
            	this.$refs.examEdit.init();
         	})
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      setActions() {
         let blocks = [];
         let types = [];
         if(this.rqReadMode) {
            types = [SELECT_RQS_MODE];
            blocks.push(types);
         }else if(this.rqExamMode) {
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
            if(this.rqExamMode) {
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