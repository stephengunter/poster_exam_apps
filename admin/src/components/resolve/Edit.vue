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
                  <p class="title"> 
                  {{ question.title }}
                  </p> 
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
                  <p> 
                     <term-tree-item v-for="(term,index) in question.terms" :key="index" 
                     :item="term" :show_subject="true"
                     />
                  </p> 
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
                        <resolve-row :question="question"
                        :model="props.item" :index="props.index"
                        :enable="enable(props.item, props.index)" :edit="isEdit(props.item, props.index)"
                        @selected="edit" @cancel="onRowCancel"
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
import { STORE_RESOLVE, UPDATE_RESOLVE, DELETE_RESOLVE, STORE_ATTACHMENT } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { onError, deepClone, isValidURL } from '@/utils';
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
					text: '附圖',
               value: '',
               width: '15%'
            },
				{
					sortable: false,
					text: '內容',
               value: '',
               width: '30%'
            },
            {
					sortable: false,
					text: '重點標記',
               value: '',
               width: '30%'
            },
            {
					sortable: false,
					text: '資料來源',
               value: '',
               width: '15%'
            },
            {
               width: '50px',
					sortable: false,
					text: '',
					value: ''
				}
         ],

         selectedIndex: -1,
         editModel: null,
         postType: 'Resolve'
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
            source: '',
            sources: [],
            highlights: [],
            attachments: [],
            medias: []
         });
      },
		onRemove(item){
         if(item.id) {
            this.remove(item.id);
         }else {
            this.question.resolves.splice(this.question.resolves.length - 1, 1);
         }
      },
      onSubmit(model) {

         if(model.sources.length) {
            model.attachments = [];
            model.medias = [];
            model.highlights = [];
            model.text = '';
         }else {
            let highlight = model.highlight;
            model.highlights = highlight.split('\n').filter(Boolean);
         }
         

         // let source = model.source;
         // let sources = source.split('\n').filter(Boolean);
         // model.sources = sources.map(item => {
         //    let parts = item.split(',');
         //    return { text: parts[0], link: parts[1] ? parts[1] : '' }
         // });

         // model.sources.forEach(item => {
         //    if(item.link) {
         //       if(!isValidURL(item.link)) item.link = '';
         //    }
         // })

         if(model.id) this.update(model);
			else this.store(model);
      },
      update(model){
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_RESOLVE, model)
			.then(() => {
            if(model.medias.length) {
               let uploadForm = {
                  postId : model.id,
                  postType: this.postType,
                  files: model.medias.map(item => item.file)
               }
               this.uploadAttachments(uploadForm);
            }else {
               this.onSaved();
            }
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
      store(model) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(STORE_RESOLVE, model)
			.then(data => {
            if(data.attachments.length) {
               let uploadForm = {
                  postId : data.id,
                  postType: data.attachments[0].postType,
                  files: model.medias.map(item => item.file)
               }
               this.uploadAttachments(uploadForm);
               
            }else {
               this.onSaved();
            }
				
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
      uploadAttachments(uploadForm) {
			let vm = this;
			vm.$store.dispatch(STORE_ATTACHMENT, uploadForm)
			.then(() => {
				vm.onSaved();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
      remove(id) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(DELETE_RESOLVE, id)
			.then(() => {
				this.onSaved();
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
      isEdit(item, index) {
         if(!item.id) return true;
         return index === this.selectedIndex;
      },
      enable(item, index) {
         if(item.id) {
            if(this.creating)  return false;
            else if(this.editting) return index === this.selectedIndex;
            return true
         }
         return true
      },
      onRowCancel() {
         if(this.editting) {
            let index = this.selectedIndex;
            this.question.resolves.splice(index, 1, { ...this.editModel });

            this.$nextTick(() => {
               this.selectedIndex = -1;
            });
            
         } 
         else if(this.creating) this.question.resolves.splice(this.question.resolves.length - 1, 1);
         
      },
      edit(index, model) {
         if(model.highlights) model.highlight = model.highlights.join('\n');
         else model.highlights = [];

         if(model.sources) {
            model.source = model.sources.map(item => `${item.text},${item.link}`).join('\n');
         }else model.sources = [];

         this.selectedIndex = index;
           //複製, 用來還原(取消編輯時)
         this.editModel = deepClone(model);
      },
      onSaved() {
         this.$emit('saved');
      }
	}
}
</script>
