<template>
   <v-card>
      <v-card-title>
         <h3>目錄 - 請選擇章節</h3>
         <v-spacer />
         <a v-if="allow_cancel" @click.prevent="cancel"  class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-layout row wrap>
            <v-flex xs6 sm6 md6>
               <v-select label="科目"
                  :items="subject_options" v-model="params.rootSubject"
                  @change="onSubjectChanged"
               />
            </v-flex>
            <v-flex xs6 sm6 md6>
               <core-search
               @submit="search" @clear="clearSearch"
               />
            </v-flex>
         </v-layout>
         <v-layout row wrap>
            <v-flex xs12>
               
               <v-treeview :items="tree_items" item-children="subItems"
               activatable hoverable return-object  active-class="primary--text"
               :active.sync="tree.active"
               >
                  <template v-slot:label="{ item }">
                     <term-tree-item :item="item" :show_title="false" :max_width="treeMaxWidth" />
                  </template>
               </v-treeview>
            </v-flex>
         </v-layout>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { onError } from '@/utils';

export default {
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
   data () {
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
      ...mapState({
			categories: state => state.categories.list
      }),
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
      search(keyword) {
         this.params.keyword = keyword;
         if(keyword) {
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