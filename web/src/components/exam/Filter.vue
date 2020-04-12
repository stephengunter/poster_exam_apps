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
            <v-col cols="12" md="6">
               <v-radio-group v-model="params.status" label="狀態">
                  <v-radio  v-for="(item, index) in status_options" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>

            </v-col>
            <v-col cols="12" md="6">
               <v-radio-group v-model="params.subject" label="科目">
                  <v-radio  v-for="(item, index) in subject_options" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>

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
export default {
   name: 'ExamFilter',
   props: {
      title: {
         type: String,
         default: '測驗紀錄'
      },
      init_params: {
         type: Object,
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
      allow_cancel: {
         type: Boolean,
         default: true
      },
   },
   data() {
		return {
         params: null
		}
   },
   computed: {
      selectedSubject() {
         if(this.subject_options && this.params.subject > 0) {
            return this.subject_options.find(item => item.value === this.params.subject);
         }     
         return null;
      },
      selectedStatus() {
         if(this.status_options && this.params.status > -1) {
            return this.status_options.find(item => item.value === this.params.status);
         }     
         return null;
      }
   },
	beforeMount() {
      this.init();
	},
	methods: {
		init() {
			let params = { ...this.init_params };
         this.params = params;
      },
      cancel() {
         this.$emit('cancel');
      },
      submit() {
         let model = {
            subject: this.selectedSubject,
            status: this.selectedStatus
         };
         this.$emit('submit', this.params, model);
      }
	}
}
</script>

<style>

</style>