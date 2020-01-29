<template>
   <div class="mb-2">
      <core-bread :items="bread.items"
      @selected="onBreadSelected"
      />
      <v-dialog v-model="modeSelector.active" :max-width="modeSelector.maxWidth" persistent>
         <rq-selector  ref="modeSelector"
         :params="params" :allow_cancel="modeSelector.selected"
         :mode_options="mode_options" :year_options="year_options"
         :subject_options="subjectOptions"
         @submit="submit" @cancel="modeSelector.active = false;"
         />
      </v-dialog>
   </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { RQS_INDEX, SELECT_RQS_MODE, EXAM_SUMMARY, ACTION_SELECTED } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { isEmptyObject, getListText } from '@/utils';

export default {
   name: 'RQHeader',
   props: {
      title: {
			type: String,
			default: ''
		},
      init_params: {
			type: Object,
			default: null
      },
      mode_options: {
			type: Array,
			default: null
      },
      year_options: {
			type: Array,
			default: null
      },
      subjects: {
			type: Array,
			default: null
      },
      
   },
   data() {
		return {
         params: {},

         subjectOptions: [],

         modeSelector: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         },

         bread: {
            items: []
         },
		}
   },
   computed: {
      ...mapGetters(['exam', 'rqReadMode', 'rqExamMode', 
		'responsive','contentMaxWidth','isAuthenticated'
      ]),
      selectedMode() {
         if(this.mode_options && !isEmptyObject(this.params)) {
            return this.mode_options.find(item => item.value === this.params.mode);
         }
         return null;
      },
      selectedYear() {
         if(this.year_options && !isEmptyObject(this.params)) {
            return this.year_options.find(item => item.value === this.params.year);
         }
         return null;
      },
      selectedSubject() {
         if(this.subjectOptions && !isEmptyObject(this.params)) {
            return this.subjectOptions.find(item => item.value === this.params.subject);
         }
         return null;
      }
   },
   methods: {
      init() {
         this.params = { ...this.init_params };
         this.subjectOptions = [];
         this.bread = {
            items: [],
            text: ''
         };
         this.modeSelector =  {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         };
      },
      load() {
         let yearOptions = this.year_options;
         let yearId = yearOptions[0].value;
         let subjectOptions = this.loadSubjectOptions(yearId, this.subjects);
         this.params.subject = subjectOptions[0].value;

         let modeOptions = this.mode_options;
         this.params.mode = modeOptions[0].value;
         this.params.year = yearId;

         this.$nextTick(() => {
            this.selectMode(false);
         })
      },
      getBread() {
         return this.bread;
      },
      onBreadSelected(item) {
         Bus.$emit(ACTION_SELECTED, item.action);
      },
      clearBread() {
         this.bread.items = [];
      },
      addBreadItem(action ,text) {
         this.bread.items.push({
            action, text
         });
      },
      setTitle() {
         this.clearBread();
         if(this.rqReadMode) {
            this.addBreadItem(SELECT_RQS_MODE, this.title);

            let selectedList = [this.selectedMode.text, this.selectedYear.text, this.selectedSubject.text];
            this.addBreadItem(SELECT_RQS_MODE, selectedList.join('_'));

         }else if(this.rqExamMode) {
            this.addBreadItem(RQS_INDEX, this.title);

            let examTitle = '無存檔名稱';
            if(this.exam && this.exam.title) examTitle = this.exam.title;
            this.addBreadItem(EXAM_SUMMARY, examTitle);
         }
         
      },
		selectMode(reset = true) {
         if(reset) this.params = { ...this.init_params };
         this.modeSelector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.modeSelector.active = true;
      },
      loadSubjectOptions(yearId, subjects = []) {
         if(!subjects) subjects = this.subjects;
         let subitems = subjects.filter(item => item.parentId === yearId);
         let options = subitems.map(item => ({
            value: item.id, text: item.title
         }));

         this.subjectOptions = options;
         return options;
      },
      checkAuth() {
         if(this.params.mode > 0) return this.isAuthenticated;
         return true;
      },
      submit() {
         let auth = this.checkAuth();
         if(!auth) {
            Bus.$emit('confirm-login', { returnUrl: this.$route.path });
            return;
         }

         this.$emit('submit', this.params);

         this.modeSelector.selected = true;
         this.modeSelector.active = false;
         
      },
      

   }
}
</script>