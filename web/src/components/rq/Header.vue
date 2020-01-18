<template>
   <div class="mb-2">
      <a href="#" @click.prevent="selectMode" class="a-btn"  >
         {{ bread.text }}
      </a>
      <v-dialog v-model="mode.active" :max-width="mode.maxWidth" persistent>
         <RQSelector  ref="modeSelector"
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
import RQSelector from '@/components/rq/Selector';

export default {
   name: 'RQHeader',
   components: {
      RQSelector
   },
   props: {
      title: {
			type: String,
			default: ''
		},
      params: {
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
         let yearOptions = this.year_options;
         let yearId = yearOptions[0].value;
         let subjectOptions = this.loadSubjectOptions(yearId, this.subjects);
         this.params.subject = subjectOptions[0].value;

         let modeOptions = this.mode_options;
         this.params.mode = modeOptions[0].value;
         this.params.year = yearId;

         this.$nextTick(() => {
            this.selectMode();
         })
      },
      addBreadItem(text) {
         this.bread.items.push(text);
         this.bread.text = getListText(this.bread.items);
      },
		selectMode() {
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

         this.$emit('submit');

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
      }

   }
}
</script>