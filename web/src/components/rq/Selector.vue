<template>
   <v-card>
      <v-card-title>
         <h3>{{ title }}</h3>
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
                  :items="year_options"
                  label="年度" v-model="params.year"
               />
            </v-col>
            <v-col cols="12" md="8">
               <v-select
                  :items="subject_options"
                  label="科目" v-model="params.subject"
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
   name: 'RQSelector',
   props: {
      title: {
         type: String,
         default: '歷屆試題'
      },
      params: {
         type: Object,
         default: null
      },
      mode_options: {
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
      }
   },
   data() {
		return {
		}
	},
	beforeMount() {
      this.init();
	},
	methods: {
		init() {
			
      },
      submit() {
         this.$emit('submit');
      }
	}
}
</script>

<style>

</style>