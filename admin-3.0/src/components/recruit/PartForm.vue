<template>
   <v-card>
      <v-card-title>
         <h3>{{ title }}</h3>
         <span v-if="Number.isInteger(model.id)" class="headline ml-3">Id : {{ model.id }}</span>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
            <v-icon>mdi-window-close</v-icon>
         </v-btn>
      </v-card-title>
      <v-card-text>
         <validation-observer ref="validator">
            <v-container>
               <v-row>
                  <v-col cols="12" sm="6">
                     <validation-provider v-slot="{ errors }" name="標題" rules="required">
                        <v-text-field label="標題" v-model="model.title" required
                        :error-messages="errors"
                        />
                     </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                     <validation-provider v-slot="{ errors }" name="分數" rules="required|numeric">
                        <v-text-field label="分數" v-model="model.points" required
                        :error-messages="errors"
                        />
                     </validation-provider>
                  </v-col>
                  <v-col cols="6">
                     <v-select label="選項數"
                        :items="countOptions" v-model="model.optionCount"
                     />
                  </v-col>
                  <v-col cols="6">
                     <v-checkbox v-model="model.multiAnswers" label="複選" />
                  </v-col>
                  <v-col cols="12">
                     <v-textarea v-model="model.ps" label="備註" outlined auto-grow
                     rows="5" row-height="15"
                     />
                  </v-col>
               </v-row>
               <v-row>
                  <v-col cols="12" class="text-right">
                     <v-btn @click.prevent="onSubmit" color="success">確定</v-btn>
                  </v-col>
               </v-row>
            </v-container>
         </validation-observer>
      </v-card-text>
   </v-card>
   
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import difference from 'lodash/difference';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'RecruitPartForm',
	props: {
		model: {
         type: Object,
         default: null
      },
      title: {
         type: String,
         default: ''
      }
	},
	data () {
		return {
         countOptions: [],
         references: {}
		}
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
      validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		},
   },
	beforeMount() {
      for(let i = 1; i <= 5; i++) {
         this.countOptions.push({
            value: i, text: i
         })
      }
   },
   mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
      cancel() {
			this.$emit('cancel');
		},
      onSubmit() {
			this.validator.validate().then(valid => {
            if(valid) this.$emit('submit');
         });     
		}
	}
}
</script>
