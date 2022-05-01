<template>
   <v-card>
      <v-card-title>
         <h3>匯入資料</h3>
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
                  <v-col cols="12">
                     <v-chip v-for="(file, index) in model.files" :key="index"
                     class="ma-1" close label outlined
                     @click:close="clearFile(index)"
                     >
                        <v-icon left>mdi-file</v-icon>{{ file.name }}
                     </v-chip>

                     <div class="mt-3" v-show="!hasFile">
                        <core-upload-button color="info" class="ma-1"
                        :multiple="true" :is_media="false" :allow_types="allowTypes"
                        @file-added="onFileAdded"
                        >
                        上傳<v-icon right dark>mdi-file</v-icon>
                        </core-upload-button>
                     </div>
                     
                  </v-col>
               </v-row>

               <core-error-list  />

               <v-row>
                  <v-col cols="12" class="text-right">
                     <v-btn :disabled="!hasFile" @click.prevent="onSubmit" color="success">確定</v-btn>
                  </v-col>
               </v-row>
            </v-container>
         </validation-observer>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DB_IMPORT } from '@/store/actions.type';

export default {
   name: 'DBImport',
   props: {
		model: {
         type: Object,
         default: null
		}
	},
   data () {
      return {
         allowTypes: ['application/JSON'],
         references: {}
      }
   },
   computed: {
      hasFile() {
         return this.model.files.length > 0;
      },
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
      clearFile(index) {
         this.model.files.splice(index, 1);
      },
      onFileAdded(files) {
         this.model.files = files;
      },
      onSubmit() {
         this.$store.commit(CLEAR_ERROR);
         this.validator.validate().then(valid => {
            if(!valid)  return;
            
            this.$store.dispatch(DB_IMPORT, this.model)
            .then(() => {
               this.onSaved();
            })
            .catch(error => {
               if(error)  this.$store.commit(SET_ERROR, error);
				   else Bus.$emit('errors');
            })
         });
		},
      cancel() {
         this.validator.reset();
         this.$emit('cancel');
      },
      onSaved() {
         this.$emit('saved');
      }
   }
}
</script>

<style>

</style>