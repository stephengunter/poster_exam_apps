<template>
   <v-card>
      <v-card-title>
         <h3>歷屆試題</h3>
         <v-spacer />
         <a href="#" v-if="allow_cancel" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="12">
               <v-radio-group v-model="params.mode">
                  <v-radio  v-for="(item, index) in modeOptions" :key="index"
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
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { isEmptyObject } from '@/utils';
export default {
   name: 'RQSelector',
   props: {
      params: {
			type: Object,
			default: null
      },
      allow_cancel: {
			type: Boolean,
			default: false
      }
   },
   data() {
		return {
         
         rootRecruitId: 0, //年度
         subjectId: 0,
         subjectOptions: [],

         model: null
		}
   },
   computed: {
      ...mapState({
         indexModel: state => state.rqs.indexModel
      }),
      ...mapGetters(['isAuthenticated'
      ]),
      yearRecruits() {
         if(this.indexModel) {
            return this.indexModel.yearRecruits;
         } return [];
      },
      subject_options() {
         if(this.indexModel) {
            return this.indexModel.subjectOptions;
         } return [];
      },
      modeOptions() {
         if(this.indexModel) {
            return this.indexModel.modeOptions;
         } return [];
      },
      selectedMode() {
         if(this.modeOptions && !isEmptyObject(this.params)) {
            return this.modeOptions.find(item => item.value === this.params.mode);
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
   beforeMount() {
      this.init();
   },
   methods: {
      init() {

         if(!this.selectedMode) this.params.mode = this.modeOptions[0].value;

         if(!this.rootRecruitId) this.rootRecruitId = this.yearOptions[0].value;
         this.onRootRecruitIdChanged();
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

         this.$emit('submit', this.model);
      },
      checkAuth() {
         if(this.params.mode > 0) return this.isAuthenticated;
         return true;
      },
      cancel() {
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>