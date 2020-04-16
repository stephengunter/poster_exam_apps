<template>
   <v-card>
      <v-card-title>
         <h3>匯入資料</h3>
         <v-spacer />
         <a href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-layout row wrap>
            <v-flex xs12>
               <v-text-field v-model="model.key" label="Key"
               v-validate="'required'"
               :error-messages="getErrMsg('key')"
               name="key"
               required
               />
            </v-flex>
            <v-flex xs12>
               <v-chip v-for="(file, index) in model.files" :key="index" close label outline @input="clearFile(index)">
                  <v-icon left>mdi-file</v-icon>{{ file.name }}
               </v-chip>
               <core-upload-button v-if="!hasFile"  :multiple="true"
               :is_media="false" :allow_types="allowTypes"
               @file-added="onFileAdded" @loading="upload.loading = true"
               @cancel="upload.loading = false"
               >
                  上傳<v-icon right dark>mdi-file</v-icon>
               </core-upload-button>
            
            </v-flex>
         </v-layout>
         <v-layout row wrap>
            
         </v-layout>
      </v-card-text>
      <v-card-actions>
         <v-spacer />
         <v-btn :disabled="!hasFile" @click.prevent="onSubmit" color="primary">確定</v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR } from '@/store/mutations.type';
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

         upload: {
            loading: false
         }
         
      }
   },
   computed: {
      hasFile() {
         return this.model.files.length > 0;
      }   
   },
   beforeMount(){
		
   },
   methods: {
      clearFile(index) {
         this.model.files.splice(index, 1);
      },
      onFileAdded(files) {
         this.model.files = files;
         this.upload.loading = false;
      },
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg;
			}
			return '';
		},
      onSubmit() {
        
         this.$validator.validate().then(valid => {
            if(!valid)  return;

            this.$store.commit(CLEAR_ERROR);
            this.$store.dispatch(DB_IMPORT, this.model)
            .then(() => {
               this.onSaved();
            })
            .catch(error => {
               Bus.$emit('errors');
            })
               
         }); 
			
		},
      cancel() {
         this.errors.clear();
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