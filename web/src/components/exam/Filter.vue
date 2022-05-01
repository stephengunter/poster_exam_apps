<template>
   <v-card>
      <v-card-text>
         <core-close-icon-button v-if="allow_cancel" @close="cancel" />
         <v-row dense>
            <v-col cols="12" md="6">
               <v-radio-group v-model="params.status" label="狀態" @change="onStatusChanged">
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
            <v-col cols="12">
               <v-select label="排序" :items="sortOptions" 
               v-model="params.sortBy" :append-outer-icon="descIcon"
               @click:append-outer="switchDesc"
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
export default {
   name: 'ExamFilter',
   props: {
      title: {
         type: String,
         default: '篩選'
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
		sortOptions() {
         if(!this.params) return [];

			let items = [{
            value: 'lastUpdated', text: '最後更新'
         }];
         if(this.params.status > 0) items.push({ value: 'score', text: '得分' });

         return items;	
		},
		descIcon() {
         if(!this.params) return '';

			if(this.params.desc) return 'mdi-arrow-down';
			else return 'mdi-arrow-up';
		}
	},
	beforeMount() {
      this.init();
	},
	methods: {
		init() {
         this.params = { ...this.init_params };
      },
      cancel() {
         this.$emit('cancel');
      },
      onStatusChanged(val) {
         if(val < 1) this.params.sortBy = 'lastUpdated';
         
      },
		switchDesc() {
			this.params.desc = !this.params.desc;
		},
      submit() {
         this.$emit('submit', this.params);
      }
	}
}
</script>

<style>

</style>