<template>
<div>
   <v-row v-if="multi">
		<v-col cols="12" sm="6" md="6">
         <v-text-field v-for="(item, index) in selected.terms" :key="index"
         readonly clearable
         :label="title" :value="getTermText(index)"
         @click="edit(index)" @click:clear="remove(index)"
         />
         <v-text-field v-if="canCreate" :label="title" value="" readonly
         @click="add"
         />
      </v-col>         
      <slot>

      </slot>
   </v-row>
   <v-row v-else>
      <v-col cols="12" sm="6" md="6">
         <v-text-field v-if="selected.terms.length" :label="title" :value="getTermText(0)" readonly clearable
         @click="edit(0)" @click:clear="remove(0)"
         />
         <v-text-field v-else :label="title" value="" readonly
         @click="add"
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
               <term-tree :items="treeItems" 
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
	name: 'TermSelector',
	props: {
      title: {
         type: String,
         default: '條文'
      },
      term_list: {
         type: Array,
         default: () => []
      },
      multi: {
         type: Boolean,
         default: false
      }
	},
	data () {
		return {
         category: null,

         selector: {
            selectedId: 0,
            version: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				category: null
			},

         selected: {
            index: -1,
            terms: [],
            textList: [],
            ids: [],
            idsText: ''
         },

         selectedText: ''
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
      canCreate() {
         if(!this.selected) return false;
         return this.selected.ids.length ? this.multi : true;
      }
   },
	methods: {
      init(selectedIds = []) {
         this.selected = {
            index: -1,
            terms: [],
            textList: [],
            ids: [],
            idsText: ''
         };
         
         if(selectedIds && selectedIds.length) {
            selectedIds.forEach(id => {
               this.selected.index = -1;
               this.setTerm(id);
            });
         }else {
            this.setTerm(0);
         }
      },
      add() {
         this.selected.index = -1;
         this.selector.selectedId =  0;

         this.selector.version += 1;
			this.selector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.selector.active = true;
      },
      edit(index) {
         this.selected.index = index;
         this.selector.selectedId =  this.selected.ids[index];

         this.selector.version += 1;
			this.selector.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.selector.active = true;
      },
      remove(index) {
         this.selected.ids.splice(index, 1);
         this.selected.terms.splice(index, 1);
         this.selected.textList.splice(index, 1);

         if(this.multi) this.$emit('changed', this.selected.ids);
         else this.$emit('changed', [0]);
      },
      setTerm(id) {
         this.category = new Category(this.term_list, id);
         this.selector.selectedId =  id;

         let item = id ? this.category.selected.item : null;
         let text = id ? this.category.selected.itemList.map(item => item.title).join(' > ') : null;
         this.setSelectedItem({ item, text })
      },
      setSelectedItem({ item, text }) {
         let id = item ? item.id : 0;
         if(this.checkValid(id)) {
            let selectingIndex = this.selected.index;
            if(selectingIndex < 0) {
               //新增
               this.selected.terms.push(item);
               this.selected.ids.push(item.id);
               this.selected.textList.push(text);
               
            }else {
               if(item) {
                  this.selected.terms.splice(selectingIndex, 1, item);
                  this.selected.ids.splice(selectingIndex, 1, item.id);
                  this.selected.textList.splice(selectingIndex, 1, text);
               }else {
                  this.remove(selectingIndex);
               }
            }
         }
      },
      checkValid(id) {
         let selectingIndex = this.selected.index;
         if(selectingIndex < 0) {
            //新增
            if(!id) return false;
            if(this.multi) {
               if(this.selected.ids.includes(id)) return false;
            }
         }else {
            if(id === this.selected.ids[selectingIndex]) return false;
         }
         return true;
      },
      cancelSelect() {
         this.selector.active = false;
      },
      onSelected(id) {
         if(id === this.selector.selectedId) return;

         if(this.checkValid(id)) this.$emit('selected', id);
      },
      getTermText(index) {
         return this.selected.textList.length > index ? this.selected.textList[index] : '';
      }     
	}
}
</script>
