<template>
   <div>
      <v-row>
         <v-col cols="12" sm="6" md="6">
            <v-text-field :label="title" :value="subjectText" readonly
            @click="selectSubject"
            />
         </v-col>
         <slot>

         </slot>
      </v-row>

      <v-dialog v-model="selector.active" persistent :max-width="selector.maxWidth">
         <subject-selector title="科目"
         :version="selector.version"
         :selected_id="selector.selectedId" :subject_list="treeItems"
         @submit="onSubjectSelected" @cancel="selector.active = false"
         />
      </v-dialog>
      
   </div>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Category  from '@/models/category';
import { onError } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'SubjectModel',
   props: {
      title: {
         type: String,
         default: '科目'
      },
      subject_list: {
         type: Array,
         default: null
      },
      selected_id: {
         type: Number,
         default: 0
      },
      show_status: {
         type: Boolean,
         default: false
      },
      show_button: {
         type: Boolean,
         default: true
      },
      version: {
         type: Number,
         default: 0
      }
   },
	data () {
		return {
         category: null,

         selector: {
            selectedId: 0,
            version: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},

			subjectText: '',
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      treeItems() {
			if(this.category) {
				return this.category.models.length ? this.category.models[0].items : [];
			}
			return [];
		},
		selectedSubject() {
			if(this.category) {
				return this.category.selected.item;
			}
			return null;
		}
   },
   watch: {
		selectedSubject:{
         handler(val) {
				if(val) {
					this.subjectText = this.category.selected.itemList.map(item => item.title).join(' > ');
				}else {
					this.subjectText = '';
				}
         },
         deep: true
		}
   },
   beforeMount() {
      console.log(this.subject_list);
   },
	methods: {
      init() {
         if(this.selected_id) this.setSubject(this.selected_id);
			else {
				this.category = new Category(this.subject_list, 0);
				this.setSubject(this.category.models[0].items[0].id);
         }
      },
      selectSubject() {
			this.selector.version += 1;
			this.selector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.selector.active = true;
		},
		setSubject(id) {
			this.category = new Category(this.subject_list, id);
			this.selector.selectedId =  id;
		},
		onSubjectSelected(id) {
			if(!id) return;

			if(id === this.selector.selectedId) return;

			this.setSubject(id);
			this.selector.active = false;

			this.$emit('selected', id);
		},
      
      
	}
}
</script>