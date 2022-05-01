<template>
<form @submit.prevent="onSubmit">
   <v-card>
      <v-card-text>
         <validation-observer ref="validator">
            <v-container>
               <v-row>
                  <v-col cols="12">
                     <v-text-field :value="user.id" label="Id" readonly
            			/>
                  </v-col>
						<v-col cols="12">
                     <v-text-field :value="user.email" label="Email" readonly
            			/>
                  </v-col>
               </v-row>

					<v-row v-if="canEdit">
                  <v-col cols="12">
                     <validation-provider v-slot="{ errors }" name="Key" rules="required|min:6|max:12">
								<v-text-field label="Key" required
								v-model="model.key"
								:error-messages="errors"
								/>
							</validation-provider>
                  </v-col>
               </v-row>

               <core-error-list  />

               <v-row v-if="canEdit">
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
   name: 'ProfileEdit',
   props: {
      user: {
         type: Object,
         default: null
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
		},
		canEdit() {
			if(this.user) return !this.user.hasPassword;
			return false;
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
      }
   }
}
</script>