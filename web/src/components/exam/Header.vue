<template>
<div>
   <div class="mb-2" v-if="responsive">
      <core-bread :items="bread.items"
      @selected="onBreadSelected"
      />
   </div>
   <div v-else>
      <v-row>
			<v-col cols="8">
            <core-bread :items="bread.items"
            @selected="onBreadSelected"
            />
			</v-col>
			<v-col cols="4" class="text-right">
            <router-link to="/exams/new" class="a-btn">
               <v-btn color="info" outlined>
                  <v-icon left>mdi-plus-circle-outline</v-icon>
                  新測驗
               </v-btn>
            </router-link>				
			</v-col>
		</v-row>
   </div>

   <v-dialog v-model="filter.active" :max-width="filter.maxWidth" persistent>
      <exam-filter v-if="filter.active" :init_params="fetchParams"
      :status_options="statusOptions" :subject_options="subjectOptions"
      @submit="submitFilter" @cancel="filter.active = false;"
      />
   </v-dialog>
   
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FILTER_EXAMS, ACTION_SELECTED } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'ExamHeader',
   props: {
      fetch_params: {
			type: Object,
			default: null
      },
      title: {
			type: String,
			default: ''
      }
   },
   data() {
		return {
         fetchParams: {},

         filter: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false,
            model: null
         },

			bread: {
            items: []
			},
		}
   },
   computed: {
      ...mapGetters(['exam', 'responsive','contentMaxWidth'
      ]),
      ...mapState({
         indexModel: state => state.exams.indexModel
      }),
      statusOptions() {
         if(this.indexModel) return this.indexModel.statusOptions;
         return [];
      },
      subjectOptions() {
         if(this.indexModel) return this.indexModel.subjectOptions;
         return [];
      }
   },
   methods: {
      init() {
         
         this.fetchParams = { ...this.fetch_params };

         this.bread = {
            items: [],
            text: ''
         };
         this.filter =  {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         };

         this.setTitle();
			
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

         let action = FILTER_EXAMS;
         this.addBreadItem(action, this.title);

         if(!this.filter.model) return;

         let selectedSubject = this.filter.model.subject;
         if(selectedSubject) {
            this.addBreadItem(action, selectedSubject.text);   
         }

         let selectedStatus = this.filter.model.status;
         if(selectedStatus) {
            this.addBreadItem(action, selectedStatus.text);   
         }

         // if(this.examIndexMode) {
         //    let action = FILTER_EXAMS;
         //    this.addBreadItem(action, this.title);

         //    if(!this.filter.model) return;

         //    let selectedSubject = this.filter.model.subject;
         //    if(selectedSubject) {
         //       this.addBreadItem(action, selectedSubject.text);   
         //    }

         //    let selectedStatus = this.filter.model.status;
         //    if(selectedStatus) {
         //       this.addBreadItem(action, selectedStatus.text);   
         //    }

         // }else if(this.examEditMode) {
         //    this.addBreadItem(EXAM_RECORDS, this.title);

         //    if(this.exam) {
         //       this.addBreadItem(EXAM_SUMMARY, this.exam.title ? this.exam.title : '無存檔名稱');
         //    }

         // }else if(this.examCreateMode) {
         //    this.addBreadItem(NEW_EXAM, '新測驗');

         //    let titleTextList = [];
         //    let type = this.creator.model.type;
         //    titleTextList.push(type.text);

         //    let recruit = this.creator.model.recruit;
         //    if(recruit) {
         //       let rootRecruit = this.creator.model.rootRecruit;
         //       titleTextList.push(rootRecruit.title);
         //    }
            
         //    let subject = this.creator.model.subject;
         //    titleTextList.push(subject.text);

         //    let title = titleTextList.join('_');
         //    this.addBreadItem(NEW_EXAM, title);
         // }
         
      },
      getBread() {
         return this.bread;
      },
      onBreadSelected(item) {
         Bus.$emit(ACTION_SELECTED, item.action);
      },
      launchFilter(reset = true) {
         if(reset)  this.fetchParams = { ...this.fetch_params };
        
         this.filter.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.filter.active = true;
      },
      submitFilter(params, model) {
         this.fetchParams = { ...params };
         this.$emit('filter-submit', params);
         this.filter.model = model;

         this.setTitle();
         this.filter.active = false;
      }
   }
}
</script>