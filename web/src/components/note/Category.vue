<template>
   <v-card>
      <core-close-icon-button v-if="allow_cancel" @close="cancel" />
      <v-card-title>
         <h3>目錄 - 請選擇章節</h3>
      </v-card-title>
      <v-card-text>
         <v-row v-if="responsive">
            <v-col cols="10">
               <v-select label="科目"
                  :items="subject_options" v-model="params.rootSubject"
                  @change="onSubjectChanged"
               />
            </v-col>
            <v-col cols="2">
               <v-btn v-if="canSearch" v-show="!showSearch" @click.prevent="showSearch = true" text icon color="info" class="mt-3">
                  <v-icon>mdi-magnify</v-icon>
               </v-btn>
            </v-col>
			</v-row>
         <v-row v-else>
            <v-col cols="6">
               <v-select label="科目"
                  :items="subject_options" v-model="params.rootSubject"
                  @change="onSubjectChanged"
               />
            </v-col>
            <v-col cols="6">
               <note-search :params="params" v-if="canSearch"
               @search="search" @clear-search="clearSearch"
               />
            </v-col>
         </v-row>
			<v-row>
            <v-col cols="12">
               <v-treeview :items="tree_items" item-children="subItems"
               activatable hoverable return-object  active-class="primary--text"
               :active.sync="tree.active"
               >
                  <template v-slot:label="{ item }">
                     <span style="font-size: 16px;">
                        {{ item.text }}
                     </span>
                  </template>
               </v-treeview>
            </v-col>
         </v-row>
         <v-row v-if="responsive" v-show="showSearch">
            <v-col cols="12">
               <note-search :params="params" v-if="canSearch"
               @search="search" @clear-search="clearSearch"
               />
            </v-col>
			</v-row>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_NOTE_CATEGORIES } from '@/store/actions.type';
import { resolveErrorData } from '@/utils';

export default {
   name: 'NoteCategory',
   props: {
      allow_cancel: {
         type: Boolean,
         default: true
      },
      version: {
         type: Number,
         default: 0
      },
      params: {
         type: Object,
         default: null
      },
      subject_options: {
			type: Array,
         default: null
      },
      tree_items: {
			type: Array,
         default: null
      },
   },
   data() {
		return {
         showSearch: false,
         tree: {
				active: []
         },
         cloneTreeActive: [],
         canceled: false
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      selectItem() {
			if(this.tree.active.length) return this.tree.active[0];
			return null;
		},
		treeMaxWidth() {
			return this.contentMaxWidth - 65;
      },
      canSearch() {
         return this.params.subject > 0;
      }
   },
   watch: {
      selectItem: 'onSelectItemChanged',
      version: 'init'
   },
	methods: {
      init() {
         this.canceled = false;
         this.cloneTreeActive = this.tree.active.slice(0);
      },
      cancel() {
         this.canceled = true;
         this.tree.active = this.cloneTreeActive.slice(0);
         this.$emit('cancel');
      },
      onSubjectChanged(val) {
         this.$emit('root-changed', val);
      },
      onSelectItemChanged(newVal, oldVal) {
         if(this.canceled && this.version > 0) return;

         if(oldVal) {
            if(oldVal.type === 'Subject') {
               if(newVal) this.params.subject = newVal.id;
               else this.params.subject = 0;
            }else {
               if(newVal) this.params.term = newVal.id;
               else this.params.term = 0;
            }
         }

         if(!newVal) return;
         
         let item = newVal;
        
         if(item.type === 'Subject') {
            this.params.subject = item.id;
            this.params.term = 0;
         }else {
            this.params.term = item.id;
            this.params.subject = 0;
            this.params.keyword = '';
         }

         if(this.selectItem.subItems.length) return;
         else this.submit();
      },
      search() {
         if(this.params.keyword) {
            this.params.term = 0;
            this.submit();
         }
      },
      clearSearch() {
         this.showSearch = false;
			this.params.keyword = '';
      },
      submit() {
         this.$emit('submit', this.params);
      }
	}
}
</script>

<style>

</style>