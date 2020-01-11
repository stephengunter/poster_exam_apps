<template>
<form @submit.prevent="onSubmit">
   <v-card>
      <v-card-title>
         <v-spacer />
         <a href="#" @click.prevent="cancel">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-container grid-list-md>
            <v-layout row wrap>
               <v-flex xs12>
                  <v-textarea v-model="question.title" label="標題" readonly
                  outlined auto-grow rows="5"
                  row-height="15"
                  />
               </v-flex>
               <v-flex xs4>
                  <v-checkbox v-model="question.multiAnswers" label="複選"  readonly
                  />
               </v-flex>
               <v-flex xs8>
                  <option-list :options="question.options" 
                  />
               </v-flex>
               <v-flex xs12>
                  <span class="title">解析</span>
                  <v-btn v-show="canCreate" @click.prevent="add" small  fab icon color="info">
                     <v-icon>mdi-plus</v-icon>
                  </v-btn>
               </v-flex>
               <v-flex xs12>
                  <v-data-table :items="question.resolves" :headers="headers"  hide-actions item-key="index">
                     <template slot="headerCell" slot-scope="{ header }">
                        <span class="subheading font-weight-light text-success text--darken-3">
                           {{ header.text }}
                        </span>
                     </template>
                     <template slot="items" slot-scope="props">
                        <resolve-row :model="props.item" 
                        :enable="enable(props.item)" :edit="isEdit(props.item)"
                        @remove="onRemove(props.item)"
                        @save="onSubmit(props.item)"
                        />
                     </template>
                  </v-data-table>
               </v-flex>
            </v-layout>
            <core-error-list />   
         </v-container>      
      </v-card-text>
   </v-card>
</form>   
</template>


<script>
import { STORE_RESOLVE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';

export default {
	name: 'ResolveEdit',
	props: {
      question: {
         type: Object,
         default: null
		}
	},
	data () {
		return {
			headers: [
				{
					sortable: false,
					text: '內容',
					value: ''
            },
            {
					sortable: false,
					text: '重點標記',
					value: ''
            },
            {
					sortable: false,
					text: '資料來源',
					value: ''
            },
            {
               width: '50px',
					sortable: false,
					text: '',
					value: ''
				}
         ],

         selectedIndex: -1
		}
   },
   computed: {
		canCreate(){
         return this.editting === false && this.creating === false
      },
      editting() {
         return this.selectedIndex > -1;
      },
      creating() {
         return this.question.resolves.findIndex(item => item.id === 0) > -1;
      }
	},
	beforeMount(){
      
	},
	methods: {
      cancel(){
			this.$emit('cancel');
		},
      getErrMsg(keys){
         let err = this.errors.collect(keys[1]);
			if(err && err.length){
            let msg = err[0];
            if(keys[0] === 'text') return msg.replace(keys[1], '內容');
				return msg;
			}
			return '';
      },
      add(){
         this.selectedIndex = -1;
         this.question.resolves.push({
            id: 0,
            questionId: this.question.id,
            highlight: '',
            source: ''
         });
      },
		onRemove(item){
         if(item.id) {

         }else {
            this.question.resolves.splice(this.question.resolves.length - 1, 1);
         }
      },
      onSubmit(model) {
         if(model.id) this.update(model);
			else this.store(model);
      },
      update(model){
         
      },
      store(model) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(STORE_RESOLVE, model)
			.then(() => {
				this.onSaved();
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
      isEdit(item) {
         if(!item.id) return true;
         else return false;
      },
      enable(item) {
         if(item.id) return false;
         else return true
      },
      onSaved() {
         this.$emit('saved');
      }
	}
}
</script>
