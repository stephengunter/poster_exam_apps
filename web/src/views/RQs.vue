<template>
   <v-container>
      <a href="#" @click.prevent="selectMode" class="a-btn" >
         {{ bread.text }}
      </a>
      
      <Part v-for="(part, index) in parts" :key="index" 
      :model="part" :start_index="getStartIndex(index)"
      />
      
      <v-dialog v-model="mode.active" :max-width="mode.maxWidth" persistent>
         <RQSelector  ref="modeSelector"
         :params="params" :allow_cancel="mode.selected"
         :mode_options="modeOptions" :year_options="yearOptions"
         :subject_options="subjectOptions"
         @submit="submitSelection" @cancel="mode.active = false;"
         />
		</v-dialog>
      
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_RQS } from '@/store/actions.type';
import { resolveErrorData, getRouteTitle, getListText, toCnNumber } from '@/utils';

import RQSelector from '@/components/rq/Selector';
import Part from '@/components/rq/Part';
export default {
   name: 'RQsView',
   components: {
      RQSelector,
      Part
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
         subjectOptions: [],
         

         mode: {
            selected: false,
            active: false,
				maxWidth: 800
         },

         questionCounts: [],

         bread: {
            items: [],
            text: ''
         },
         loginConfirm: {
				color: 'info',
				show: false,
				title: '需要登入',
				text: '您目前執行的程序需要登入.',
				returnUrl: ''
			}
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
      modeSelecting() {
         return this.mode.active;
      },
      isReadMode() {
         return this.params.mode === 0;
      }
   },
	beforeMount() {
      let title = getRouteTitle(this.$route);
      this.title = title;
      this.fetchData();
   },
	methods: {
      addBreadItem(text) {
         this.bread.items.push(text);
         this.bread.text = getListText(this.bread.items);
      },
		selectMode() {
         if(this.contentMaxWidth) this.mode.maxWidth = this.contentMaxWidth;
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
      submitSelection() {
         let auth = this.checkAuth();
         if(!auth) {
            Bus.$emit('confirm-login', { returnUrl: this.$route.path });
            return;
         }
        
         let params = this.params;
        
         this.mode.active = false;
         this.mode.selected = true;
         this.fetchData();

         this.bread.items = [this.title];
         let mode = this.modeOptions.find(item => item.value === this.params.mode);
         this.addBreadItem(mode.text);

         let year = this.yearOptions.find(item => item.value === this.params.year);
         this.addBreadItem(year.text);

         let subject = this.subjectOptions.find(item => item.value === this.params.subject);
         this.addBreadItem(subject.text);
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

               let yearId = model.yearOptions[0].value;
               let subjectOptions = this.loadSubjectOptions(yearId, model.subjects);
               this.params.subject = subjectOptions[0].value;

               this.params.mode = model.modeOptions[0].value;
               this.params.year = yearId;

               this.$nextTick(() => {
                  this.selectMode();
               })
            }else {
               if(this.isReadMode) this.loadReadData(model);
               else this.loadExamData(model);
            }
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      loadReadData(model) {
         this.questionCounts = model.parts.map(part => part.questions.totalItems);
      },
      loadExamData(model) {
         console.log('loadExamData', model);
      },
      getStartIndex(index) {
         if(index < 1) return 1;
         return this.questionCounts[index - 1] + 1;
      }
	}
}
</script>

<style>

</style>