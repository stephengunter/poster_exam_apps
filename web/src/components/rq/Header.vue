<template>
   <div class="mb-2">
      <core-bread :items="bread.items"
      @selected="onBreadSelected"
      />
      <v-dialog v-model="selector.active" :max-width="selector.maxWidth" persistent>
         <v-card>
            <v-card-title>
               <h3>歷屆試題</h3>
               <v-spacer />
               <a href="#" v-if="selector.selected" @click.prevent="selector.active = false" class="a-btn">
                  <v-icon>mdi-window-close</v-icon>
               </a>
            </v-card-title>
            <v-card-text>
               <v-row>
                  <v-col cols="12">
                     <v-radio-group v-model="params.mode">
                        <v-radio  v-for="(item, index) in mode_options" :key="index"
                        :label="item.text" :value="item.value" 
                        />
                     </v-radio-group>

                  </v-col>
               </v-row>
               <v-row>
                  <v-col cols="12" md="4">
                     <v-select
                        :items="yearOptions"
                        label="年度" v-model="rootRecruitId"
                        @change="onRootRecruitIdChanged"
                     />
                  </v-col>
                  <v-col cols="12" md="8">
                     <v-select
                        :items="subjectOptions"
                        label="科目" v-model="subjectId"
                        @change="onSubjectChanged"
                        name="subject" :error-messages="getErrMsg('subject')"
                     />
                  </v-col>
               </v-row>
            </v-card-text>
            <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn @click="submit" color="success">
                  確定
               </v-btn>
            </v-card-actions>
         </v-card>
      </v-dialog>
   </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { RQS_INDEX, SELECT_RQS_MODE, EXAM_SUMMARY, ACTION_SELECTED } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { isEmptyObject, getListText } from '@/utils';

export default {
   name: 'RQHeader',
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
      }
   },
   data() {
		return {
         rootRecruitId: 0, //年度
         subjectId: 0,
         subjectOptions: [],
         model: null,

         selector: {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         },

         bread: {
            items: []
         }
		}
   },
   computed: {
      ...mapGetters(['exam', 'rqReadMode', 'rqExamMode', 
		'responsive','contentMaxWidth','isAuthenticated'
      ]),
      ...mapState({
         yearRecruits: state => state.rqs.yearRecruits,
         subject_options: state => state.rqs.subjectOptions
      }),
      selectedMode() {
         if(this.mode_options && !isEmptyObject(this.params)) {
            return this.mode_options.find(item => item.value === this.params.mode);
         }
         return null;
      },
      selectedRootRecruit() {
         if(this.rootRecruitId) return this.yearRecruits.find(item => item.id === this.rootRecruitId);
         return null;
      },
      selectedRecruit() {
         if(this.selectedRootRecruit) return this.selectedRootRecruit.subItems.find(item => item.subjectId === this.subjectId);         
         return null;
      },
      selectedSubject() {
         if(this.subjectOptions && !isEmptyObject(this.params)) {
            return this.subjectOptions.find(item => item.value === this.subjectId);
         }
         return null;
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
         this.bread = {
            items: [],
            text: ''
         };
         this.selector =  {
            active: false,
            maxWidth: DIALOG_MAX_WIDTH,
            selected: false
         };
      },
      load() {
        
         this.rootRecruitId = this.yearOptions[0].value;
         this.onRootRecruitIdChanged();

         this.$nextTick(() => {
            this.selectMode();
         })
      },
      onRootRecruitIdChanged() {
         this.setSubjectOptions();

         let ids = this.subjectOptions.map(item => item.value);
         if(!ids.includes(this.subjectId)) this.subjectId = ids[0];
      },
      setSubjectOptions() {
         let subjectIds = this.selectedRootRecruit.subItems.map(item => item.subjectId);
         this.subjectOptions = this.subject_options.filter(item => subjectIds.includes(item.value));
      },
      onSubjectChanged(val) {
         if(val) this.errors.remove('subject');
      },
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('subject', '科目');
			}
			return '';
      },
      getBread() {
         return this.bread;
      },
      onBreadSelected(item) {
         Bus.$emit(ACTION_SELECTED, item.action);
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

         if(this.rqReadMode) {
            this.addBreadItem(SELECT_RQS_MODE, this.title);
            // 閱讀, 108年度, 專業科目1
            let selectedList = [this.selectedMode.text, this.selectedRootRecruit.title, this.selectedSubject.text];
            this.addBreadItem(SELECT_RQS_MODE, selectedList.join('_'));

         }else if(this.rqExamMode) {
            this.addBreadItem(RQS_INDEX, this.title);

            let examTitle = '無存檔名稱';
            if(this.exam && this.exam.title) examTitle = this.exam.title;
            this.addBreadItem(EXAM_SUMMARY, examTitle);
         }
         
      },
		selectMode() {
         this.selector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.selector.active = true;
      },
      checkAuth() {
         if(this.params.mode > 0) return this.isAuthenticated;
         return true;
      },
      submit() {
         this.$validator.validate().then(valid => {
            if(!valid) return;
            if(this.selectedRecruit) {
               this.params.recruit = this.selectedRecruit.id
            }else {
               this.errors.add({
                  field: 'subject',
                  msg: '請選擇科目'
               });
            }
         })

         if(this.errors.any()) return;

         let auth = this.checkAuth();
         if(!auth) {
            Bus.$emit('confirm-login', { returnUrl: this.$route.path });
            return;
         }

         this.model = {
            mode: this.selectedMode,
            rootRecruit: this.selectedRootRecruit,
            recruit: this.selectedRecruit,
            subject: this.selectedSubject
         };

         this.$nextTick(() => {
            this.$emit('submit');
            this.selector.selected = true;
            this.selector.active = false;
         });
      },
      getModel() {
         return this.model;
      }
      

   }
}
</script>