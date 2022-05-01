<template>
   <v-row>
      <v-col cols="12">
         <span v-text="title" style="font-size:1.2rem; font-weight: 700;"></span>
         <v-btn @click.prevent="add" class="mx-2 mb-2" fab dark small color="info">
            <v-icon dark>mdi-plus</v-icon>
         </v-btn>
      </v-col>
      <v-col cols="12">
         <recruit-part-table :models="models"
         @edit="edit" @remove="remove"
         />
      </v-col>
      <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<recruit-part-form v-if="editor.active" :model="editor.model"
         :title="editor.title"
			@submit="onEditorSubmit" @cancel="cancelEdit"
			/>
		</v-dialog>
   </v-row>
   
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import difference from 'lodash/difference';
import { DIALOG_MAX_WIDTH } from '@/config';
import { uuid } from '@/utils';

export default {
	name: 'RecruitPartEdit',
	props: {
		parent_id: {
         type: Number,
         default: 0
      },
      init_models: {
         type: Array,
         default: null
      }
	},
	data () {
		return {
         title: '子項目',
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
		...mapGetters(['contentMaxWidth'])
   },
	beforeMount() {
      if(this.init_models) this.models = this.init_models.slice(0);
	},
	methods: {
      add() {
         this.setEditModel({
            id: uuid(),
            parentId: this.parent_id,
            title: '',
            points: 0,
            optionCount: 4,
            multiAnswers: false          
         });
      },
      edit(id) {
         let model = this.models.find(item => item.id === id);
         this.setEditModel({ ...model });
      },
      setEditModel(model) {
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
         let model = this.editor.model;

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
