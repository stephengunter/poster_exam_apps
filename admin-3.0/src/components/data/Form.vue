<template>
<form @submit.prevent="onSubmit">
   <v-card>
      <v-card-title>
         <h3>{{ title }}</h3>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
				<v-icon>mdi-window-close</v-icon>
			</v-btn>
      </v-card-title>
      <v-card-text>
         <validation-observer ref="validator">
            <v-container>
               <v-row>
                  <v-col cols="12">
                     <validation-provider v-slot="{ errors }" name="Key" rules="required">
								<v-text-field label="Key" required
								v-model="model.key"
								:error-messages="errors"
								/>
							</validation-provider>
                  </v-col>
               </v-row>

               <core-error-list  />

               <v-row>
                  <v-col cols="12" class="text-right">
                     <v-btn @click.prevent="onSubmit" color="success">確定</v-btn>
                  </v-col>
               </v-row>
            </v-container>
         </validation-observer>
      </v-card-text>
   </v-card>
</form>
</template>

<script>
import { SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';

export default {
   name: 'DataForm',
   props: {
      db_name: {
         type: String,
         default: ''
      },
      title: {
         type: String,
         default: ''
      },
      model: {
         type: Object,
         default: null
		}
   },
   data () {
		return {
			references: {}
		}
   },
   computed: {
      validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
   },
   mounted() {
		this.references = { ...this.$refs };
	},
   methods: {
      onSubmit() {
         this.$store.commit(CLEAR_ERROR);
         this.validator.validate().then(valid => {
            if(valid) this.$emit('submit');
         }); 
      },
      cancel() {
         this.$store.commit(CLEAR_ERROR);
         this.validator.reset();
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>