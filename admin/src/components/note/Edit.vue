<template>
   <v-layout row wrap>
      <v-flex sm12>
         <v-btn @click.prevent="add" small  fab icon color="info">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <span class="title" v-text="term.fullText"></span>
      </v-flex>
      <v-flex sm12>
         <v-data-table :items="term.notes" :headers="headers"  hide-actions item-key="index">
            <template slot="headerCell" slot-scope="{ header }">
               <span class="subheading font-weight-light text-success text--darken-3">
                  {{ header.text }}
               </span>
            </template>
            <template slot="items" slot-scope="props">
               <note-row :model="props.item" :index="props.index"
               :enable="enable(props.item, props.index)" :edit="isEdit(props.item, props.index)"
               @selected="edit" @cancel="onRowCancel"
               @remove="onRemove(props.item)"
               @save="onSubmit(props.item)"
               />
            </template>
         </v-data-table>
      </v-flex>
   </v-layout>
   
</template>


<script>
import { STORE_NOTE, UPDATE_NOTE, DELETE_NOTE, STORE_ATTACHMENT } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { onError, deepClone, isValidURL } from '@/utils';
export default {
	name: 'NoteEdit',
	props: {
      term: {
         type: Object,
         default: null
      },
      version: {
         type: Number,
         default: 0
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
         postType: 'Note'
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
         return this.term.notes.findIndex(item => item.id === 0) > -1;
      }
   },
   watch: {
      version: 'init'
   },
	methods: {
      init() {
         this.selectedIndex = -1;
      },
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
         this.term.notes.push({
            id: 0,
            termId: this.term.id,
            highlight: '',
            source: '',
            attachments: [],
            medias: []
         });
      },
		onRemove(item){
         if(item.id) {
            this.$emit('remove', item);
            //this.remove(item.id);
         }else {
            this.term.notes.splice(this.term.notes.length - 1, 1);
         }
      },
      onSubmit(model) {
         let highlight = model.highlight;
         model.highlights = highlight.split('\n').filter(Boolean);

         let source = model.source;
         let sources = source.split('\n').filter(Boolean);
         model.sources = sources.map(item => {
            let parts = item.split(',');
            return { text: parts[0], link: parts[1] ? parts[1] : '' }
         });

         model.sources.forEach(item => {
            if(item.link) {
               if(!isValidURL(item.link)) item.link = '';
            }
         })

         if(model.id) this.update(model);
			else this.store(model);
      },
      update(model){
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_NOTE, model)
			.then(() => {
            console.log('medias', model.medias);
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
         this.$store.dispatch(STORE_NOTE, model)
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
         this.$store.dispatch(DELETE_NOTE, id)
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
            this.term.notes.splice(index, 1, { ...this.editModel });

            this.$nextTick(() => {
               this.selectedIndex = -1;
            });
            
         } 
         else if(this.creating) this.term.notes.splice(this.term.notes.length - 1, 1);
         

         this.$emit('row-canceled');
      },
      edit(index, model) {
         if(model.highlights) model.highlight = model.highlights.join('\n');
         else item.highlights = [];

         if(model.sources) {
            model.source = model.sources.map(item => `${item.text},${item.link}`).join('\n');
         }else model.sources = [];

         this.selectedIndex = index;
           //複製, 用來還原(取消編輯時)
         this.editModel = deepClone(model);
      },
      onSaved() {
         this.$emit('saved');
         this.selectedIndex = -1;
      }
	}
}
</script>
