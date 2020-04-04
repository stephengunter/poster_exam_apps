<template>
   <v-card v-if="model">
      <v-card-title>
         <span class="title">加入精選試題</span>
         <v-spacer />
         <a href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-container grid-list-md>
            <v-flex xs12 v-if="term">
               <p class="title"> 
               {{ term.title }}
               
               <span v-html="term.text"></span>
               </p> 
            </v-flex>
            <v-flex xs12>
               <v-text-field v-model="model.questionId" label="試題Id"
               v-validate="'required|numeric'"
               :error-messages="getErrMsg('questionId')"
               name="questionId"
               required
               />
            </v-flex>
         </v-container>
         
      </v-card-text>
      <v-card-actions>
         <v-spacer />
         <v-btn type="submit" @click.prevent="save" color="primary">存檔</v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import { STORE_TERM_QUESTION } from '@/store/actions.type';

export default {
   name: 'TermQuestionEdit',
   props: {
      version: {
         type: Number,
         default: 0
      },
      term: {
         type: Object,
         default: null
      },
   },
   watch: {
      version: 'init'
   },
   data () {
      return {
         model: null
      }
   },
   methods: {
      init() {
         this.model = { termId: this.term.id, questionId: '' };
      },
      cancel() {
         this.$emit('cancel');
      },
      getErrMsg(key){
			let err = this.errors.collect(key);
			if(err && err.length){
				let msg = err[0];
				return msg.replace('questionId', '試題Id');
			}
			return '';
		},
      save() {
         this.$validator.validate().then(valid => {
            if(!valid) return;
            this.$store.dispatch(STORE_TERM_QUESTION, this.model)
            .then(() => {
               this.$emit('saved');
            })
            .catch(error => {
               Bus.$emit('errors');
            })
         }); 
      }
   }
}
</script>

<style>

</style>