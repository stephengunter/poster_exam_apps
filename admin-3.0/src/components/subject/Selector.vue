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
         <v-card>
            <v-card-title>
               <h3>{{ `選擇${title}` }}</h3>
               <v-spacer />
               <v-btn @click.prevent="cancelSelect" icon>
                  <v-icon>mdi-window-close</v-icon>
               </v-btn>
            </v-card-title>
            <v-card-text>
               <v-container>
                  <subject-tree :items="treeItems" 
                  :selected_id="selector.selectedId" :version="selector.version"
                  @selected="onSelected"
                  />
               </v-container>
            </v-card-text>
         </v-card>
      </v-dialog>
      
   </div>	
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Category  from '@/models/category';
import { onError } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   name: 'SubjectSelector',
   props: {
      title: {
         type: String,
         default: '科目'
      },
      subject_list: {
         type: Array,
         default: null
      },
      show_status: {
         type: Boolean,
         default: true
      },
      show_button: {
         type: Boolean,
         default: false
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
	methods: {
      init(selectedId = 0) {
         this.setSubject(selectedId);
      },
      selectSubject() {
			this.selector.version += 1;
			this.selector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.selector.active = true;
      },
      cancelSelect() {
         this.selector.active = false;
      },
		onSelected(id) {
         if(id != this.selector.selectedId) this.$emit('selected', id);
      },
      setSubject(id) {
			this.category = new Category(this.subject_list, id);
         this.selector.selectedId =  id;
		}
      
      
	}
}
</script>