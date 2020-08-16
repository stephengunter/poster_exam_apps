<template>
   <v-row row wrap>
      <v-col cols="12">
         <span v-text="title" style="font-size:1.2rem; font-weight: 700;"></span>
         <v-btn v-if="canAdd" @click.prevent="add" class="mx-2 mb-2" fab dark small color="info" >
            <v-icon>mdi-plus</v-icon>
         </v-btn>
         <v-btn v-else icon disabled class="mb-2">
            <v-icon>mdi-plus</v-icon>
         </v-btn>
      </v-col>
      <v-col cols="12">
         <recruit-sub-item-table :models="models"
         @edit="edit" @remove="remove"
         />
      </v-col>
      <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<recruit-sub-item-form v-if="editor.active" :model="editor.model"
         :title="editor.title" :subject_options="subject_options"
			@submit="onEditorSubmit" @cancel="cancelEdit"
			/>
		</v-dialog>
   </v-row>
   
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import difference from 'lodash/difference';
import { SET_ERROR, CLEAR_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { uuid } from '@/utils';

export default {
	name: 'RecruitSubItemEdit',
	props: {
		parent_id: {
         type: Number,
         default: 0
      },
      init_models: {
         type: Array,
         default: null
      },
      subject_options: {
         type: Array,
         default: null
		}
	},
	data () {
		return {
         title: '筆試項目',
         models: [],

         editor: {
            title: '',
				active: false,
				maxWidth: 800,
				model: null
			}
		}
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
      allSubjectIds() {
         if(this.subject_options) return this.subject_options.map(item => item.value);
         return [];         
      },
      selectedSubjectIds() {
         return this.models.map(item => item.subjectId);
      },
      canSelectSubjectIds() {
         return difference(this.allSubjectIds, this.selectedSubjectIds);
      },
      canAdd() {
         return this.canSelectSubjectIds.length > 0;
      }
   },
	beforeMount() {
      if(this.init_models) this.models = this.init_models.slice(0);
      
      this.models.forEach(model => {
         if(model.subjectId && !model.subject) {
            let subject = this.subject_options.find(x => x.value === model.subjectId);
            if(subject) model.subject = { id: model.subjectId, title: subject.text };
         }
      });
	},
	methods: {
      edit(id) {
         let model = this.models.find(item => item.id === id);
         this.setEditModel({ ...model });
      },
      add() {
         
         this.setEditModel({
            id: uuid(),
            parentId: this.parent_id,
            title: '',
            subjectId: this.subject_options[0].value,
            points: 0,
            optionCount: 4,
            multiAnswers: false          
         });
      },
      setEditModel(model) {
         this.$store.commit(CLEAR_ERROR);
			if(model) {
            this.editor.title = isNaN(model.id) ? `新增${this.title}` : `編輯${this.title}`;
				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
      },
      cancelEdit() {
			this.setEditModel(null);
		},
		remove(id) {
         let index = this.models.findIndex(item => item.id === id);
         if(index > -1) this.models.splice(index, 1);
      },
      onEditorSubmit() {
         let model = { ...this.editor.model };
         
         let existSubject = this.models.findIndex(item => item.subjectId === model.subjectId && item.id != model.id);
         if(existSubject > -1) {
            this.$store.commit(SET_ERROR, { 'subjectId' : ['科目重複了'] });
            return;
         }

         if(!model.subject) {
            let subject = this.subject_options.find(x => x.value === model.subjectId);
            if(subject) model.subject = { id: model.subjectId, title: subject.text };
         }

         if(isNaN(model.id)) {
            this.models.push(model);
         }else {
            let index = this.models.findIndex(item => item.id === model.id);
            if(index > -1) this.models.splice(index, 1, { ...model });
         }

         this.setEditModel(null);
      },
      submit() {
         let models = this.models.slice(0);
         for(let i = 0; i < models.length; i++) {
            if(isNaN(models[i].id)) models[i].id = 0;
         }
         this.$emit('submit', models);
      }
	}
}
</script>
