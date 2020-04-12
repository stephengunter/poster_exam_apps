<template>
<div>
   <div class="mb-2" v-if="responsive">
      <core-bread :items="bread.items"
      @selected="onBreadSelected"
      />
   </div>
   <div v-else>
      <v-row>
			<v-col :cols="examIndexMode ? 8 : 12">
            <core-bread :items="bread.items"  class_name="pt-2"
            @selected="onBreadSelected"
            />
			</v-col>
			<v-col v-if="examIndexMode" cols="4" class="text-right">
				<v-btn color="info" outlined  @click.prevent="launchCreator">
					<v-icon left>mdi-plus-circle-outline</v-icon>
					新測驗
         	</v-btn>
			</v-col>
		</v-row>
   </div>

   <v-dialog v-model="filter.active" :max-width="filter.maxWidth" persistent>
      <exam-filter v-if="filter.active" :init_params="fetchParams"
      :status_options="statusOptions" :subject_options="subjectOptions"
      @submit="submitFilter" @cancel="filter.active = false;"
      />
   </v-dialog>
   <v-dialog v-model="creator.active" :max-width="creator.maxWidth" persistent>
      <exam-creator v-if="creator.active"  :init_params="createParams"
      :type_options="typeOptions" :recruit_type_options="rTypeOptions"
      :year_options="yearOptions" :subject_options="subjectOptions"
      :year_recruits="yearRecruits"
      @submit="submitCreator" @cancel="creator.active = false;"
      />
   </v-dialog>
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FILTER_EXAMS, EXAM_SUMMARY, ACTION_SELECTED,
   EXAM_RECORDS, NEW_EXAM 
} from '@/store/actions.type';

import { DIALOG_MAX_WIDTH } from '@/config';
import { getListText } from '@/utils';

export default {
   name: 'ExamHeader',
   props: {
      fetch_params: {
			type: Object,
			default: null
      },
      create_params: {
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
         createParams: {},

         filter: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false,
            model: null
         },

         creator: {
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
      ...mapGetters(['exam', 'examIndexMode', 'examCreateMode', 'examEditMode', 
		'responsive','contentMaxWidth','isAuthenticated'
      ]),
      ...mapState({
         indexModel: state => state.exams.indexModel,
			mode: state => state.exams.mode
      }),
      statusOptions() {
         if(this.indexModel) return this.indexModel.statusOptions;
         return [];
      },
      typeOptions() {
         if(this.indexModel) return this.indexModel.examTypeOptions;
         return [];
      },
      rTypeOptions() {
         if(this.indexModel) return this.indexModel.recruitExamTypeOptions;
         return [];
      },
      subjectOptions() {
         if(this.indexModel) return this.indexModel.subjectOptions;
         return [];
      },
      yearRecruits() {
         if(this.indexModel) return this.indexModel.yearRecruits;
         return [];
      },
      yearOptions() {
         if(this.yearRecruits) {
            return this.yearRecruits.map(item => ({
               value: item.id, text: item.title
            }));
         }
         return [];
      }
   },
   methods: {
      init() {
         this.fetchParams = { ...this.fetch_params };
         this.createParams = { ...this.create_params };

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

         if(this.examIndexMode) {
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

         }else if(this.examEditMode) {
            this.addBreadItem(EXAM_RECORDS, this.title);

            if(this.exam) {
               this.addBreadItem(EXAM_SUMMARY, this.exam.title ? this.exam.title : '無存檔名稱');
            }

         }else if(this.examCreateMode) {
            this.addBreadItem(NEW_EXAM, '新測驗');

            let titleTextList = [];
            let type = this.creator.model.type;
            titleTextList.push(type.text);

            let recruit = this.creator.model.recruit;
            if(recruit) {
               let rootRecruit = this.creator.model.rootRecruit;
               titleTextList.push(rootRecruit.title);
            }
            
            let subject = this.creator.model.subject;
            titleTextList.push(subject.text);

            let title = titleTextList.join('_');
            this.addBreadItem(NEW_EXAM, title);
         }
         
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
      },
      launchCreator(reset = true) {
         if(reset)  this.createParams = { ...this.create_params };

         this.creator.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.creator.active = true;
      },
      submitCreator(params, model) {
         this.createParams = { ...params };
         this.$emit('creator-submit', params);
         
         this.creator.model = model;
         this.creator.active = false;
      }

   }
}
</script>