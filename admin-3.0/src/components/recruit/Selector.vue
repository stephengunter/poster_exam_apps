<template>
<div>
   <div v-if="multi">
      <v-text-field v-for="(item, index) in selected.recruits" :key="index"
      readonly clearable
      :label="title" :value="getRecruitText(index)"
      @click="edit(index)" @click:clear="remove(index)"
      />
      <v-text-field v-if="canCreate" :label="title" value="" readonly
      @click="add"
      />
   </div>
   <div v-else>
      <v-text-field v-if="selected.recruits.length" :label="title" :value="getRecruitText(0)" readonly
      :clearable="allow_empty"
      @click="edit(0)" @click:clear="remove(0)"
      />
      <v-text-field v-else :label="title" value="" readonly
      @click="add"
      />
   </div>

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
               <recruit-tree :items="treeItems" 
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
	name: 'RecruitSelector',
	props: {
      title: {
         type: String,
         default: '考古題'
      },
      recruit_list: {
         type: Array,
         default: () => []
      },
      multi: {
         type: Boolean,
         default: false
      },
      allow_empty: {
         type: Boolean,
         default: true
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
            recruits: [],
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
            recruits: [],
            textList: [],
            ids: [],
            idsText: ''
         };
         
         if(selectedIds && selectedIds.length) {
            selectedIds.forEach(id => {
               this.selected.index = -1;
               this.setRecruit(id);
            });
         }else {
            this.setRecruit(0);
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
         this.selected.recruits.splice(index, 1);
         this.selected.textList.splice(index, 1);

         if(this.multi) this.$emit('changed', this.selected.ids);
         else this.$emit('changed', [0]);
      },
      setRecruit(id) {
         this.category = new Category(this.recruit_list, id);
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
               this.selected.recruits.push(item);
               this.selected.ids.push(item.id);
               this.selected.textList.push(text);
               
            }else {
               if(item) {
                  this.selected.recruits.splice(selectingIndex, 1, item);
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
      getRecruitText(index) {
         return this.selected.textList.length > index ? this.selected.textList[index] : '';
      }     
	}
}
</script>
