<template>
   <v-container>
      <rq-header ref="rqHeader" :title="title"
      :params="params" :mode_options="modeOptions"
      @submit="onSelectionSubmit"
      />
      <div v-show="rqReadMode">
         <rq-read ref="rqRead" :model="model" />
      </div>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import {
   LOAD_ACTIONS, ACTION_SELECTED, 
   RQS_INDEX, FETCH_RQS, SELECT_RQS_MODE 
} from '@/store/actions.type';
import { SET_RQS_PAGE_MODE, 
SET_EXAM_CREATE_PARAMS, SET_LOADING } from '@/store/mutations.type';

import { resolveErrorData, getRouteTitle } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'RQsView',
   data() {
		return {
         pageName: 'rqs',
         title: '',

         params: {
            mode: -1,
            recruit: 0
         },

         confirm: {
            title: '',
            text: '',
            active: false,
            action: '',
            maxWidth: DIALOG_MAX_WIDTH
         },

         references: {}
		}
   },
   computed: {
      ...mapGetters(['exam', 'rqReadMode', 'rqExamMode', 
		'responsive','contentMaxWidth','isAuthenticated'
		]),
      ...mapState({
         mode: state => state.rqs.mode,
         model: state => state.rqs.model,
         modeOptions: state => state.rqs.modeOptions,
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
            recruit: 0
         };

         this.rqHeader.init();
         
         this.pageName = this.$route.name;
         let title = getRouteTitle(this.$route);
         this.title = title;
         
         this.fetchData(this.params);
      },
      loadHeader() {
         let modeOptions = this.modeOptions;
         if(this.params.mode < 0) this.params.mode = modeOptions[0].value;

         this.rqHeader.load();
      },
      setMode(val) {
         this.$store.commit(SET_RQS_PAGE_MODE, val);
         this.$nextTick(() => {
				if(this.rqReadMode) {
               this.fetchData(this.params);
               this.setActions();
            }else if(this.rqExamMode) {
               this.createExam(this.params)
            }
         })
      },
      onSelectionSubmit() {
         this.setMode(this.params.mode);
      },
      fetchData(params) {
         this.$store.dispatch(FETCH_RQS, params)
         .then(model => {
            if(this.firstLoad) {
               this.$store.commit(SET_RQS_PAGE_MODE);
               this.$nextTick(() => {
                  this.loadHeader();
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
         this.$store.commit(SET_LOADING, true);
         this.$store.commit(SET_EXAM_CREATE_PARAMS, { recruit: params.recruit });
         this.$router.push({ path: '/exams/new' });
      },
      setActions() {
         let blocks = [];
         let types = [];
         if(this.rqReadMode) {
            types = [SELECT_RQS_MODE];
            blocks.push(types);
            this.$store.dispatch(LOAD_ACTIONS, blocks);
         }
      },
      onActionSelected(name) {
         if(this.$route.name !== this.pageName) return;

         if(name === SELECT_RQS_MODE || name === RQS_INDEX) {
            this.rqHeader.selectMode();            
         }else {
            
         }
      }      
	}
}
</script>