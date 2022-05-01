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
            <v-col cols="12">
               <v-select v-show="exactlyRecruit"
                  :items="year_options"
                  label="年度" v-model="rootRecruitId"
                  @change="onRootRecruitIdChanged"
               />
               <v-select
                  :items="subjectOptions"
                  label="科目" v-model="params.subject"
                  @change="onSubjectChanged"
                  name="subject" :error-messages="getErrMsg('subject')"
               />
            </v-col>
			</v-row>
      </v-card-text>
      <v-card-actions>
         <v-spacer></v-spacer>
         <v-btn @click="onSubmit" color="success">
            確定
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
      year_recruits: {
         type: Array,
         default: null
      },
      allow_cancel: {
         type: Boolean,
         default: true
      },
      auto: {
         type: Boolean,
         default: false
      },
   },
   data() {
		return {
         params: {},
         rootRecruitId: 0, //年度
         subjectOptions: [],
         model: {},
		}
   },
   computed: {
      ...mapGetters(['currentUser', 'userIsSubscriber']),
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
      selectedType() {
         if(this.type_options) return this.type_options.find(item => item.value === this.params.type);
         return null;
      },
      selectedRootRecruit() {
         if(this.rootRecruitId) return this.year_recruits.find(item => item.id === this.rootRecruitId);
         return null;
      },
      selectedRecruit() {
         if(this.selectedRootRecruit) return this.selectedRootRecruit.subItems.find(item => item.subjectId === this.params.subject);         
         return null;
      }
   },
   beforeMount() {
      this.init();
   },
	methods: {
		init() {
         this.params = { ...this.init_params };

         if(this.params.type < 1) this.setType(this.type_options[0]);
         else this.setType(this.selectedType);
      },
      setRootRecruitId(val) {
         this.rootRecruitId = val;
         this.onRootRecruitIdChanged();
      },
      setType(item) {
         this.params.type = item.value;
         this.onTypeChanged(item.value);
      },
      onTypeChanged(val) {
         this.setRootRecruitId(this.year_options[0].value);

         let rtypeItem = null;
         if(isRecruitSource(val)) { //歷屆試題
            //預設為'完全相同'
            rtypeItem = this.recruit_type_options.find(item => isExactlyRecruit(item.value)); //完全相同
            this.setRType(rtypeItem);
         }else if(isRandomSource(val)) {  //系統自訂
           // 不限年度
            rtypeItem = this.recruit_type_options.find(item => isCrossYearsRecruit(item.value)); //不限年度
            this.setRType(rtypeItem);
         }
      },
      setRType(item) {
         this.params.rtype = item.value;
         this.onRTypeChanged(item.value);
      },
      onRTypeChanged(val) {
         
      },
      onRootRecruitIdChanged() {
         this.setSubjectOptions();

         let ids = this.subjectOptions.map(item => item.value);
         if(!ids.includes(this.params.subject)) this.params.subject = 0;
      },
      setSubjectOptions() {
         if(this.exactlyRecruit) {
            let subjectIds = this.selectedRootRecruit.subItems.map(item => item.subjectId);
            this.subjectOptions = this.subject_options.filter(item => subjectIds.includes(item.value));
         }else this.subjectOptions = this.subject_options.filter(item => item.value > 0);
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
      cancel() {
         this.$emit('cancel');
      },
      onSubmit() {
         this.$validator.validate().then(valid => {
            if(!valid) return;

            if(this.exactlyRecruit) {
               //歷屆試題, 完全相同
               if(!this.params.subject) {
                  this.errors.add({
                     field: 'subject',
                     msg: '請選擇科目'
                  });
               }else {
                  //必須要有 recruit
                  this.params.recruit = this.selectedRecruit.id;
               }
            }else {
               if(!this.params.subject) {
                  this.errors.add({
                     field: 'subject',
                     msg: '請選擇科目'
                  });
               }else {
                  this.params.recruit = 0;
               }
            }

            if(this.errors.any()) return;

            if(this.userIsSubscriber) this.submit();
            else {
               if(this.params.recruit) this.submit();
               else {
                  //未訂閱者僅限歷屆試題
                  this.onNotSubscriber();
               }
            }

            
         });
      },
      onNotSubscriber() {
         Bus.$emit('errors', { status: 403 });
      },
      submit() {
         let params = this.params;
         let model = {
            rootRecruit: this.selectedRootRecruit,
            recruit: this.selectedRecruit,
            type: this.type_options.find(item => item.value === params.type),
            rtype: this.recruit_type_options.find(item => item.value === params.rtype),
            subject: this.subjectOptions.find(item => item.value === params.subject)
         };
         this.model = model;
         this.$emit('submit', params, model);
      }
	}
}
</script>

<style>

</style>