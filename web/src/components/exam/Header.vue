<template>
<div>
   <div class="mb-2" v-if="responsive">
      <a href="#" @click.prevent="onTitltClicked" class="a-btn"  >
         {{ bread.text ?  bread.text : title }}
      </a>
   </div>
   <div v-else>
      <v-row>
			<v-col :cols="isIndexMode ? 8 : 12">
				<a href="#" @click.prevent="onTitltClicked" class="a-btn"  >
					{{ bread.text ?  bread.text : title }}
				</a>
			</v-col>
			<v-col v-if="isIndexMode" cols="4" class="text-right">
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
import { EXAM_SUMMARY, ACTION_SELECTED } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { getListText } from '@/utils';

export default {
   name: 'ExamHeader',
   props: {
      mode: {
			type: Object,
			default: null
      },
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
      },
      exam: {
			type: Object,
			default: null
      },
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
            items: [],
            text: ''
			},
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth','isAuthenticated']),
      isIndexMode() {
         return this.mode && this.mode.name === 'index';
      },
      isCreateMode() {
         return this.mode && this.mode.name === 'create';
		},
		isEditMode() {
         return this.mode && this.mode.name === 'edit';
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
      addBreadItem(text) {
         this.bread.items.push(text);
         this.bread.text = getListText(this.bread.items);
      },
      setTitle() {
         if(this.isIndexMode) {
            let params = this.fetchParams;

            let subjectText = '';
            if(params.subject > 0) {
               let subject = this.subject_options.find(item => item.value === params.subject);
               subjectText = subject.text;
            }

            let statusText = '';
            if(params.status > -1) {
               let status = this.status_options.find(item => item.value === params.status);
               statusText = status.text;
            }

            this.bread.items = [this.title];
            this.addBreadItem(this.mode.text);

            if(statusText) this.addBreadItem(statusText);
            if(subjectText) this.addBreadItem(subjectText);

         }else if(this.isEditMode) {
            this.bread.items = [this.title];
            this.addBreadItem(this.exam.title);

         }else if(this.isCreateMode) {
            this.bread.items = [this.title];
            this.addBreadItem('新測驗');

            let type = this.creator.model.type;
            this.addBreadItem(type.text);

            let year = this.creator.model.year;
            if(year.value) this.addBreadItem(`${year.text}年度`);
            
            let subject = this.creator.model.subject;
            this.addBreadItem(subject.text);
         }
         
      },
      getBread() {
         return this.bread;
      },
      onTitltClicked() {
         if(this.isIndexMode) {
            this.launchFilter();
         }else if(this.isEditMode) {
            Bus.$emit(ACTION_SELECTED,EXAM_SUMMARY);
         }
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