<template>
<div>
   <div class="mb-2" v-if="responsive">
      <core-bread @selected="onBreadSelected" />
   </div>
   <div v-else>
      <v-row>
			<v-col cols="8">
            <core-bread @selected="onBreadSelected" />
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
      <exam-filter v-if="filter.active" :init_params="params"
      :status_options="statusOptions" :subject_options="subjectOptions"
      @submit="submitFilter" @cancel="filter.active = false;"
      />
   </v-dialog>
   
</div>   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FILTER_EXAMS, ACTION_SELECTED } from '@/store/actions.type';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { tryParseInt } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'ExamHeader',
   props: {
      init_params: {
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
         params: {},

         filter: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         }
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth'
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
      },
      selectedSubject() {
         if(this.subjectOptions && this.params.subject > 0) {
            return this.subjectOptions.find(item => item.value === this.params.subject);
         }     
         return null;
      },
      selectedStatus() {
         if(this.statusOptions && this.params.status > -1) {
            return this.statusOptions.find(item => item.value === this.params.status);
         }     
         return null;
      }
   },
   methods: {
      init() {
         this.params = { ...this.init_params };

         this.filter =  {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         };

         this.setTitle();
      },
      setTitle() {
         
         let items = [{
            action: FILTER_EXAMS, text: this.title
         }];
         
         if(this.selectedSubject) {
            items.push({
               action: FILTER_EXAMS, text: this.selectedSubject.text
            }); 
         }

         if(this.selectedStatus) {
            items.push({
               action: FILTER_EXAMS, text: this.selectedStatus.text
            }); 
         }

         this.$store.commit(SET_BREAD_ITEMS, items);
         
      },
      onBreadSelected(item) {
         Bus.$emit(ACTION_SELECTED, item.action);
      },
      launchFilter(reset = true) {
         if(reset)  this.params = { ...this.init_params };
        
         this.filter.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.filter.active = true;
      },
      submitFilter(params) {
         this.params = { ...params };
         this.setTitle();
         this.filter.active = false;
         this.$emit('filter-submit', params);
         // this.$nextTick(() => {
         //    this.$emit('filter-submit', params);
         //    this.setTitle();
         //    this.filter.active = false;
         // })
         
      }
   }
}
</script>