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
      :status_options="status_options" :subject_options="subject_options"
      @submit="submitFilter" @cancel="filter.active = false;"
      />
   </v-dialog>
   <v-dialog v-model="creator.active" :max-width="creator.maxWidth" persistent>
      <exam-creator v-if="creator.active"  :init_params="createParams"
      :type_options="type_options" :recruit_type_options="recruit_type_options"
      :year_options="year_options" :subject_options="subject_options"
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
      },
      type_options: {
         type: Array,
         default: null
      },
      recruit_type_options: {
         type: Array,
         default: null
      },
      year_options: {
         type: Array,
         default: null
      },
      status_options: {
         type: Array,
         default: null
      },
      subject_options: {
         type: Array,
         default: null
      }
   },
   data() {
		return {
         fetchParams: {},
         createParams: {},

         filter: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
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
			mode: state => state.exams.mode
      })
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
            let params = this.fetchParams;
            let action = FILTER_EXAMS;
            this.addBreadItem(action, this.title);

            let selectedSubject = null;
            if(this.fetchParams.subject > 0) {
               selectedSubject =  this.subject_options.find(item => item.value === this.fetchParams.subject);
            }

            if(selectedSubject) this.addBreadItem(action, selectedSubject.text);
            
            let selectedStatus = null;
            if(this.fetchParams.status > -1) {
               selectedStatus =  this.status_options.find(item => item.value === this.fetchParams.status);
            }

            if(selectedStatus) this.addBreadItem(action, selectedStatus.text);

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

            let year = this.creator.model.year;
            titleTextList.push(`${year.text}年度`);
            
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
      submitFilter(params) {
         this.fetchParams = { ...params };
         this.$emit('filter-submit', params);
      
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