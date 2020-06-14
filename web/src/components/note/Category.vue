<template>
   <v-card>
      <core-close-icon-button v-if="allow_cancel" @close="cancel" />
      <v-card-title>
         <h3>{{ title }}</h3>
      </v-card-title>
      <v-card-text>
         <v-row v-if="mode_options.length">
            <v-col cols="12">
               <v-radio-group v-model="params.mode" @change="onModeChanged">
                  <v-radio  v-for="(item, index) in mode_options" :key="index"
                  :label="item.text" :value="item.value"
                  />
               </v-radio-group>

            </v-col>
			</v-row>
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
               <span v-if="errText" class="red--text">{{ errText }}</span>
              
               <v-treeview v-if="allow_select" :items="tree_items" item-children="subItems"
               activatable hoverable return-object  active-class="primary--text"
               :active.sync="tree.active"
               >
                  <template v-slot:label="{ item }">
                     <span style="font-size: 16px;">
                        {{ item.text }}
                     </span>
                  </template>
               </v-treeview>
               <v-treeview v-else :items="tree_items" item-children="subItems"
               hoverable return-object  active-class="primary--text"
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
      <v-card-actions v-if="allow_select">
         <v-spacer></v-spacer>
         <v-btn @click="submit" color="success">
            確定
         </v-btn>
      </v-card-actions>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { resolveErrorData } from '@/utils';

export default {
   name: 'NoteCategory',
   props: {
      allow_select: {
         type: Boolean,
         default: true
      },
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
      mode_options: {
			type: Array,
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
         errText: '',
         tree: {
				active: []
         },
         cloneTreeActive: [],
         canceled: false
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      title() {
         return '讀書筆記 - 目錄';
      },
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
      onModeChanged(val) {
         
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

         this.onParamsChanged();

         if(this.selectItem.subItems.length) return;
         else this.submit();
      },
      onParamsChanged() {
         this.errText = '';
      },
      search() {
         if(this.params.keyword) {
            this.params.term = 0;
            this.params.mode = 0;
            this.submit();
         }
      },
      clearSearch() {
         this.showSearch = false;
			this.params.keyword = '';
      },
      submit() {
         if(this.params.term) {
            this.$emit('submit', this.params);
         }else {
            if(this.params.subject) {
               if(this.params.keyword) {
                  this.params.term = 0;
                  this.params.mode = 0;
                  this.$emit('submit', this.params);
               }else if(this.selectItem.subItems.length < 1) {
                  this.$emit('submit', this.params);
               }
               else this.errText = '請選擇章節';
            }            
            else this.errText = '請選擇章節';
         }
         
      }
	}
}
</script>

<style>

</style>