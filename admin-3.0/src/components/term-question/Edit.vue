<template>
   <v-card v-if="model">
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
                  <v-col cols="12" v-if="term" class="title">
                     {{ term.title }}
                     <span v-html="term.text"></span>
                  </v-col>
                  <v-col cols="12">
                     <validation-provider v-slot="{ errors }" name="試題Id" rules="required|numeric">
                        <v-text-field v-model="model.questionId" label="試題Id"
                        :error-messages="errors" required
                        />
                     </validation-provider>
                  </v-col>
               </v-row>
               <core-error-list  />
               <v-row>
						<v-col class="text-right">
							<v-btn @click.prevent="onSubmit" color="success">存檔</v-btn>
						</v-col>
					</v-row>
            </v-container>
			</validation-observer>
      </v-card-text>
   </v-card>
</template>

<script>
import { STORE_TERM_QUESTION } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
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
   data () {
      return {
         title: '加入精選試題',
         model: null
      }
   },
   computed: {
		validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		}
	},
	beforeMount() {
		this.init();
   },
   mounted() {
      this.references = { ...this.$refs };
	},
   methods: {
      init() {
         this.model = { termId: this.term.id, questionId: '' };
      },
      cancel() {
         this.$emit('cancel');
         if(this.validator) this.validator.reset();
      },
      onSubmit() {
         this.$store.commit(CLEAR_ERROR);
         this.model.questionId = parseInt(this.model.questionId);

         this.validator.validate().then(valid => {
            if(!valid) return;

            this.submit();
         }); 
      },
      submit() {
         this.$store.dispatch(STORE_TERM_QUESTION, this.model)
         .then(() => {
            this.$emit('saved');
         })
         .catch(error => {
            if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
         });
      }
   }
}
</script>

<style>

</style>