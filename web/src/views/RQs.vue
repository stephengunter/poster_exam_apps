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
         @aborted="onExamAborted" @leave="onLeaveExam"
         /> 
      </div>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import {
   LOAD_ACTIONS, ACTION_SELECTED, EXAM_SUMMARY,
   RQS_INDEX, FETCH_RQS, SELECT_RQS_MODE, CREATE_EXAM,
   STORE_EXAM, SAVE_EXAM, ABORT_EXAM, LEAVE_EXAM 
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

         confirm: {
            title: '',
            text: '',
            active: false,
            action: '',
				maxWidth: DIALOG_MAX_WIDTH
         }
		}
   },
   beforeRouteLeave(to, from, next) {
      //檢查是否有未存檔的測驗
      if(this.rqExamMode) {
         this.examEdit.handleAction(LEAVE_EXAM, next);
         return;
      }else {
         next();
      }
   },
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
      rqHeader() {
			if(this.$refs.rqHeader) return this.$refs.rqHeader;
			else if (this.references.rqHeader) return this.references.rqHeader;
			return null;
      },
      rqRead() {
			if(this.$refs.rqRead) return this.$refs.rqRead;
			else if (this.references.rqRead) return this.references.rqRead;
			return null;
		},
      examEdit() {
			if(this.$refs.examEdit) return this.$refs.examEdit;
			else if (this.references.examEdit) return this.references.examEdit;
			return null;
		},
      firstLoad() {
         return this.params.mode < 0;
      }
   },
   created(){
		Bus.$on(ACTION_SELECTED, this.onActionSelected);
	},
   mounted() {
		this.references = { ...this.$refs };
		this.init();
	},
	methods: {
      init() {
         this.params = {
            mode: -1,
            year: 0,
            subject: 0
         };

         this.rqHeader.init();

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
                  this.rqHeader.load();
               })
            }else {
               this.rqHeader.setTitle();   
            }
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      createExam(params) {
         let mode = this.rqHeader.selectedMode;
         let year = this.rqHeader.selectedYear;
         let subject = this.rqHeader.selectedSubject;
         let items = [mode.text, year.text, subject.text];

         this.$store.dispatch(CREATE_EXAM, { recruit: params.subject })
         .then(exam => {
            let title = `${items.join('_')}_${todayString().replace(/-/g,'')}`;
            this.$store.commit(SET_EXAM_TITLE, title);

            this.$nextTick(() => {
               this.rqHeader.setTitle();
               this.setActions();
            	this.examEdit.init();
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
				blocks.push([RQS_INDEX, EXAM_SUMMARY]);
				blocks.push(this.examActions.map(item => item.name));
         }

         this.$store.dispatch(LOAD_ACTIONS, blocks);
      },
      onActionSelected(name) {
         if(this.rqExamMode) {
            this.examEdit.handleAction(name);
            return;
         }

         if(name === SELECT_RQS_MODE || name === RQS_INDEX) {
            this.rqHeader.selectMode();            
         }else {
            
         }
      },
      onExamAborted() {
         this.init();
      },
      onLeaveExam() {
         this.init();
      }
      
	}
}
</script>