<template>
   <v-container>
      <a href="#" @click.prevent="selectMode" style="text-decoration: none;" >
         {{ bread.text }}
      </a>
      四選一單選選擇題共 50 題，每題 2 分
      <Part v-if="false" />
      <v-dialog v-model="mode.active" :max-width="mode.maxWidth">
         <RQSelector  ref="modeSelector"
         :params="params"
         :mode_options="modeOptions" :year_options="yearOptions"
         :subject_options="subjectOptions"
         @submit="mode.active = false;"
         />
		</v-dialog>
   </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_RQS } from '@/store/actions.type';
import { resolveErrorData, getRouteTitle, getListText } from '@/utils';

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
            active: false,
				maxWidth: 800
         },

         bread: {
            items: [],
            text: ''
         },

         parts: []
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      ...mapState({
			questions: state => state.rqs.questions
		}),
      firstLoad() {
         return this.params.mode < 0;
      },
      modeSelecting() {
         return this.mode.active;
      },
      breadTitle() {

      }
   },
   watch: {
      modeSelecting(val) {
         if(!val) this.submitSelection();
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
      submitSelection() {
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
         console.log('params', params);
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
              
               let multiParts = model.parts.length > 1;
               for(let i = 0; i < model.parts.length; i++) {
                  let part = model.parts[i];
                  console.log('part', part);
                  //part.totalItems
               }
            }
         })
			.catch(error => {
            Bus.$emit('errors', resolveErrorData(error));
			})
      },
      getPartTitle() {

      }
	}
}
</script>

<style>

</style>