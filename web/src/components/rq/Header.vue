<template>
   <div class="mb-2">
      <a href="#" @click.prevent="onTitltClicked" class="a-btn"  >
         {{ bread.text ?  bread.text : title }}
      </a>
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
import { EXAM_SUMMARY, ACTION_SELECTED } from '@/store/actions.type';
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
            items: [],
            text: ''
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
      addBreadItem(text) {
         this.bread.items.push(text);
         this.bread.text = getListText(this.bread.items);
      },
      onTitltClicked() {
         if(this.rqReadMode) {
            this.selectMode();
         }else if(this.rqExamMode) {
            Bus.$emit(ACTION_SELECTED, EXAM_SUMMARY);
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
      setTitle() {
         if(this.rqReadMode) {

            this.bread.items = [this.title];
            this.addBreadItem(this.selectedMode.text);
            this.addBreadItem(this.selectedYear.text);
            this.addBreadItem(this.selectedSubject.text);

         }else if(this.rqExamMode) {
            this.bread.items = [this.title];
            if(this.exam) this.addBreadItem(this.exam.title);
         }
         
      }

   }
}
</script>