<template>
   <div class="mb-2">
      <a href="#" @click.prevent="selectMode" class="a-btn"  >
         {{ bread.text ?  bread.text : title }}
      </a>
      <v-dialog v-model="mode.active" :max-width="mode.maxWidth" persistent>
         <rq-selector  ref="modeSelector"
         :params="params" :allow_cancel="mode.selected"
         :mode_options="mode_options" :year_options="year_options"
         :subject_options="subjectOptions"
         @submit="submit" @cancel="mode.active = false;"
         />
      </v-dialog>
   </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { getListText } from '@/utils';

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

         mode: {
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
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated'])
   },
   methods: {
      init() {
         this.params = { ...this.init_params };
         this.subjectOptions = [];
         this.bread = {
            items: [],
            text: ''
         };
         this.mode =  {
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
		selectMode(reset = true) {
         if(reset) this.params = { ...this.init_params };
         this.mode.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.mode.active = true;
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

         this.mode.selected = true;
         this.mode.active = false;
         this.setTitle();
         
      },
      setTitle() {
         this.bread.items = [this.title];

         let modeOptions = this.mode_options;
         let mode = modeOptions.find(item => item.value === this.params.mode);
         this.addBreadItem(mode.text);

         let yearOptions = this.year_options;
         let year = yearOptions.find(item => item.value === this.params.year);
         this.addBreadItem(year.text);

         let subject = this.subjectOptions.find(item => item.value === this.params.subject);
         this.addBreadItem(subject.text);
      },
      getTitle() {
         return this.bread.text;
      },
      getBread() {
         return this.bread;
      }

   }
}
</script>