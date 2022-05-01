<template>
<form @submit.prevent="onSubmit">
   <v-card>
      <v-card-title>
         <h3>編輯解析</h3>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
            <v-icon>mdi-window-close</v-icon>
         </v-btn>
      </v-card-title>
      <v-card-text>
         <v-container>
            <v-row>
               <v-col cols="12">
                  <p style="font-size:16px"> 
                  {{ question.title }}
                  </p> 
               </v-col>
               <v-col cols="4">
                  <v-checkbox v-model="question.multiAnswers" label="複選"  readonly
                  />
               </v-col>
               <v-col cols="8">
                  <option-list :options="question.options" 
                  />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <term-item v-for="(term,index) in question.terms" :key="index" 
                  :item="term" :show_subject="true"
                  />
               </v-col>
            </v-row>
            <v-row>
               <v-col cols="12">
                  <span class="titleText">解析</span>
                  <core-button-create v-show="canCreate"
                  class_name="ml-3 mb-2" tooltip="新增"
                  @create="add"
                  />
               </v-col>
               <v-col cols="12">
                  <validation-observer ref="validator">
                     <v-data-table :items="question.resolves" :headers="headers"  :server-items-length="question.resolves ? question.resolves.length : 0"
                     hide-default-footer  item-key="index"
                     >
                        <template v-slot:body="{ items }">
                           <tbody>
                              <resolve-row v-for="(item, index) in items" :key="index"
                              :question="question" :model="item" :index="index"
                              :enable="enable(item, index)" :edit="isEdit(item, index)"
                              @selected="edit" @cancel="onRowCancel"
                              @content-changed="onContentChanged(item)"
                              @remove="onRemove(item)" @save="onSubmit(item)"
                              />
                           </tbody>   
                        </template>
                     </v-data-table>
                  </validation-observer>
               </v-col>
            </v-row>
            <core-error-list />   
         </v-container>      
      </v-card-text>
   </v-card>
</form>   
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { STORE_RESOLVE, UPDATE_RESOLVE, DELETE_RESOLVE, 
INIT_MEDIAS, STORE_ATTACHMENT
} from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { addErrorMsg, getErrorMsg, clearErrors, onError, deepClone, isValidURL } from '@/utils';
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
               width: '25%'
            },
            {
					sortable: false,
					text: '資料來源',
               value: '',
               width: '25%'
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
         postType: 'Resolve',

         references: {},
		}
   },
   computed: {
      ...mapState({
			medias: state => state.medias.medias,
			attachments: state => state.medias.attachments,
		}),
		canCreate(){
         return this.editting === false && this.creating === false
      },
      editting() {
         return this.selectedIndex > -1;
      },
      creating() {
         return this.question.resolves.findIndex(item => item.id === 0) > -1;
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
      cancel(){
			this.$emit('cancel');
		},
      add() {
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
         this.$store.dispatch(INIT_MEDIAS, []);
      },
      edit(index, model) {
         if(model.highlights) model.highlight = model.highlights.join('\n');
         else model.highlights = [];

         if(model.sources) {
            model.source = model.sources.map(item => `${item.text},${item.link}`).join('\n');
         }else model.sources = [];

         this.$store.dispatch(INIT_MEDIAS, model.attachments);
         this.selectedIndex = index;
           //複製, 用來還原(取消編輯時)
         this.editModel = deepClone(model);
      },
		onRemove(item){
         if(item.id) {
            this.remove(item.id);
         }else {
            this.question.resolves.splice(this.question.resolves.length - 1, 1);
         }
      },
      onContentChanged(model) {
         if(model.sources.length) this.clearContentError();
         else {
            if(model.text) this.clearContentError();
            else if(this.attachments.length) this.clearContentError();
         }
      },
      onSubmit(model) {
         model.medias = this.medias.slice(0);
         model.attachments = this.attachments.slice(0);

         this.clearContentError();
         this.$store.commit(CLEAR_ERROR);

         if(model.sources.length) this.save(model);
         else {
            if(this.checkContent(model)) this.save(model);
            else this.addContentError();
         }
      },
      save(model) {
         if(model.sources.length) {
            model.attachments = [];
            model.medias = [];
            model.highlights = [];
            model.text = '';
         }else {
            let highlight = model.highlight;
            model.highlights = highlight.split('\n').filter(Boolean);
         }

         if(model.id) this.update(model);
			else this.store(model);
      },
      checkContent(model) {
         if(model.text) return true;
         if(model.attachments.length) return true;
         return false;
		},
      addContentError(msg = '必須填寫內容') {
			addErrorMsg(this.validator, '內容', msg);
		},
		clearContentError() {
			let errors = clearErrors(this.validator.errors, ['內容']);
			this.validator.setErrors(errors);
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
      onSaved() {
         this.$emit('saved');
      }
	}
}
</script>
