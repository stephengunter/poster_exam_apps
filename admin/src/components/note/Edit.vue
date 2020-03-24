<template>
   <v-layout row wrap>
      <v-flex sm12>
         <v-btn @click.prevent="add" small  fab icon color="info">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <term-read :term="term" />
      </v-flex>
      <v-flex sm12 v-show="activeNotes.length">
         <note-table ref="tableNotes" 
         :notes="notes" :seleted_index="selectedIndex"
         :editting="editting" :creating="creating"
         @edit="edit" @row-canceled="onRowCancel"
         @remove="onRemove" @submit="onSubmit"
         @showPhoto="showPhoto"
         />
      </v-flex>
      <v-flex sm12 >
         <span class="title">相關試題</span>
         <v-btn small @click.prevent="addQuestion" fab icon color="warning">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <div v-if="hasQuestions">
            <question-table :list="term.questions" :show_recruits="false" :show_resolves="false"
            :can_remove="true" :can_edit="false"
            @remove="removeQuestion"
            />
         </div>
         
      </v-flex>
   </v-layout>
   
</template>


<script>
import Sortable from 'sortablejs';
import { STORE_NOTE, UPDATE_NOTE, DELETE_NOTE, ORDER_NOTES,
CREATE_NOTE, STORE_ATTACHMENT
} from '@/store/actions.type';

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
         selectedIndex: -1,
         editModel: null,
         postType: 'Note',

         sortable: null,
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
      },
      notes() {
         return this.activeNotes.concat(this.unactiveNotes);
      },
      activeNotes() {
         if(this.term && this.term.notes) {
            return this.term.notes.filter(item => item.active);
         }else  return [];
      },
      unactiveNotes() {
         if(this.term && this.term.notes) {
            return this.term.notes.filter(item => !item.active);
         }else  return [];
      },
      hasQuestions() {
         if(!this.term) return false;
          return this.term.questions && this.term.questions.length;
      }
   },
   watch: {
      version: 'init'
   },
   mounted() {
      this.bindSortable();
   },
	methods: {
      init() {
         this.selectedIndex = -1;
      },
      bindSortable() {
         const el = this.$refs.tableNotes.$el.getElementsByTagName('tbody')[0];
         this.sortable = Sortable.create(
            el,
            {
               draggable: '.row-note',
               onEnd: this.onDragEnd
            }
         );
      },
      onDragEnd ({ oldIndex, newIndex }) {
			if(oldIndex === newIndex) return;

			let up = oldIndex > newIndex;

			let targetId = this.term.notes[oldIndex].id;
         let replaceId = this.term.notes[newIndex].id;

			this.$store.dispatch(ORDER_NOTES, { targetId, replaceId, up })
			.then(() => {
            this.$emit('order-updated');
				Bus.$emit('success');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})       		
      },
      showPhoto(photo){
         this.$emit('show-photo', photo);
      },
      add(){
         let term = this.term.id;
         this.$store.dispatch(CREATE_NOTE, { term })
			.then(model => {
            model.medias = [];
            this.selectedIndex = -1;
            this.term.notes.push(model);
			})
			.catch(error => {
				Bus.$emit('errors');
			}) 
         
      },
      edit(index, model) {
         if(model.highlights) model.highlight = model.highlights.join('\n');
         else model.highlights = [];

         if(model.references && model.references.length) {
            model.reference = model.references.map(item => `${item.text},${item.id},${item.type}`).join('\n');
         }else model.reference = '';

         this.selectedIndex = index;
           //複製, 用來還原(取消編輯時)
         this.editModel = deepClone(model);
      },
		onRemove(item){
         if(item.id) {
            this.$emit('remove', item);
         }else {
            this.term.notes.splice(this.term.notes.length - 1, 1);
         }
      },
      onSubmit(model) {
         let highlight = model.highlight;
         model.highlights = highlight ? highlight.split('\n').filter(Boolean) : [];

         let reference = model.reference;
         if(reference) {
				let references = reference.split('\n').filter(Boolean);
					model.references = references.map(item => {
					let parts = item.split(',');
					return { text: parts[0], id: parts[1] ? parts[1] : '', type:  parts[2] ? parts[2] : ''}
				});
			}else {
				model.references = [];
         }

         if(model.id) this.update(model);
			else this.store(model);
      },
      update(model){
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_NOTE, model)
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
      onRowCancel() {
         if(this.editting) {
            let index = this.selectedIndex;
            this.term.notes.splice(index, 1, { ...this.editModel });

            this.$nextTick(() => {
               this.selectedIndex = -1;
            });
            
         } 
         else if(this.creating) this.term.notes.splice(this.term.notes.length - 1, 1);
         
      },
      onSaved() {
         this.$emit('saved');
         this.selectedIndex = -1;
      },
      addQuestion() {
         this.$emit('add-question', this.term.id);
      },
      removeQuestion(id) {
         this.$emit('remove-question', { termId: this.term.id, questionId: id });
      }
	}
}
</script>
