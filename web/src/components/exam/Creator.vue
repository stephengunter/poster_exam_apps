<template>
   <v-card>
      <v-card-title>
         <h3>{{ title }}</h3>
         <v-spacer />
         <a href="#" v-if="allow_cancel" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="6">
               <v-radio-group v-model="params.type" label="題庫來源" @change="onTypeChanged">
                  <v-radio  v-for="(item, index) in type_options" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>
            </v-col>
            <v-col cols="6">
               <v-radio-group v-show="recruitSource" v-model="params.rtype" label="試題配置" @change="onRTypeChanged">
                  <v-radio  v-for="(item, index) in recruit_type_options" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>
            </v-col>
			</v-row>
         <v-row>
            <v-col cols="12" md="4">
               <v-select :disabled="!exactlyRecruit"
                  :items="year_options"
                  label="年度" v-model="params.year"
                  @change="onYearChanged"
               />
            </v-col>
            <v-col cols="12" md="8">
               <v-select
                  :items="subjectOptions"
                  label="科目" v-model="params.subject"
                  @change="onSubjectChanged"
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
</template>

<script>
import { isRecruitSource, isRandomSource, isExactlyRecruit, isCrossYearsRecruit } from '@/utils';
export default {
   name: 'ExamCreator',
   props: {
      title: {
         type: String,
         default: '建立新測驗'
      },
      init_params: {
         type: Object,
         default: null
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
      subject_options: {
         type: Array,
         default: null
      },
      allow_cancel: {
         type: Boolean,
         default: true
      },
   },
   data() {
		return {
         params: {},
         model: {},
         subjectOptions: []
		}
   },
   computed: {
      recruitSource() {
         return isRecruitSource(this.params.type);
      },
      randomSource() {
         return isRandomSource(this.params.type);
      },
      exactlyRecruit() {
         return isExactlyRecruit(this.params.rtype);
      },
      crossYearsRecruit() {
         return isCrossYearsRecruit(this.params.rtype);
      },
   },
	beforeMount() {
      this.init();
	},
	methods: {
		init() {
         this.subjectOptions = this.subject_options.filter(item => item.value > 0);

         this.params = { ...this.init_params };

         if(this.params.subject < 1) this.setSubject(this.subjectOptions[0]);
         if(this.params.type < 1) this.setType(this.type_options[0]);
         
      },
      setType(item) {
         this.params.type = item.value;
         this.onTypeChanged(item.value);

         this.model.type = item;
      },
      onTypeChanged(val) {
         let rtypeItem = null;
         if(isRecruitSource(val)) { //歷屆試題
            rtypeItem = this.recruit_type_options.find(item => isExactlyRecruit(item.value)); //完全相同
            this.setRType(rtypeItem);
         }else if(isRandomSource(val)) {  //系統自訂
            rtypeItem = this.recruit_type_options.find(item => isCrossYearsRecruit(item.value)); //不限年度
            this.setRType(rtypeItem);
         }


         if(!this.model.type || this.model.type.value !== val) {
            this.model.type = this.type_options.find(item => item.value === val);
         }
      },
      setRType(item) {
         this.params.rtype = item.value;
         this.onRTypeChanged(item.value);

         this.model.rtype = item;
      },
      onRTypeChanged(val) {
         let yearItem = null;
         if(isExactlyRecruit(val)) { //完全相同
            if(this.params.year < 1) {
               yearItem = this.year_options.find(item => item.value > 0); 
               this.setYear(yearItem);
            }
         }else if(isCrossYearsRecruit(val)) { //不限年度
            yearItem = this.year_options.find(item => item.value < 1); //全部年度
            this.setYear(yearItem);
         }

         if(!this.model.rtype || this.model.rtype.value !== val) {
            this.model.rtype = this.recruit_type_options.find(item => item.value === val);
         } 
      },
      setYear(item) {
         this.params.year = item.value;
         this.onYearChanged(item.value);

         this.model.year = item;
      },
      onYearChanged(val) {
         if(!this.model.year || this.model.year.value !== val) {
            this.model.year = this.year_options.find(item => item.value === val);
         }
      },
      setSubject(item) {
         this.params.subject = item.value;
         this.onSubjectChanged(item.value);

         this.model.subject = item;
      },
      onSubjectChanged(val) {
         if(!this.model.subject || this.model.subject.value !== val) {
            this.model.subject = this.subjectOptions.find(item => item.value === val);
         }
      },
      cancel() {
         this.$emit('cancel');
      },
      submit() {
         console.log('model', this.model);
         this.$emit('submit', this.params, this.model);
      }
	}
}
</script>

<style>

</style>