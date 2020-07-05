<template>
   <v-card v-show="ready">
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
              
               <v-treeview v-if="allow_select" :open="tree.open"
               :items="tree_items" item-children="subItems"  item-key="id"
               activatable active-class="primary--text"
               :active.sync="tree.active"
               >
                  <template v-slot:label="{ item, active }">
                     <v-btn text>
                        <span style="font-size: 16px;" :class="{ 'primary--text' : active }">
                           {{ item.text }}
                        </span>
                     </v-btn>
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
         ready: false,
         showSearch: false,
         errText: '',
         tree: {
            open: [],
            active: [],
            selectedType: ''
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
      selectId() {
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
      selectId(newVal, oldVal) {
         if(!this.ready) return;
         if(this.canceled && this.version > 0) return;
         this.onSelectIdChanged(newVal, oldVal);
      },
      version: 'init'
   },
   beforeMount() {
      if(this.params.subject) this.tree.open = [this.params.subject];
      if(this.params.term) this.tree.active = [this.params.term];
      
      if(this.tree.active.length) this.onSelectIdChanged(this.tree.active[0], null);
      else this.ready = true;
   },
	methods: {
      init() {
         this.canceled = false;
         this.cloneTreeActive = this.tree.active.slice(0);
         this.ready = true;
      },
      cancel() {
         this.canceled = true;
         this.tree.active = this.cloneTreeActive.slice(0);
         this.$emit('cancel');
         this.ready = false;
      },
      onSubjectChanged(val) {
         this.$emit('root-changed', val);
      },
      onModeChanged(val) {
         
      },
      onSelectIdChanged(newVal, oldVal) {
         if(!newVal) {
            if(this.tree.selectedType === 'Subject') this.params.subject = 0;
            else if(this.tree.selectedType === 'Term') this.params.term = 0;

            this.tree.selectedType = '';
            return;
         } 
         
         let item = this.tree_items.find(x => x.id === newVal);
         if(item) {
            this.tree.selectedType = 'Subject';
            //選擇的是Subject
            this.params.subject = newVal;
            this.params.term = 0;

            this.errText = '';
         }else {
            //選擇的是Term
            this.tree.selectedType = 'Term';

            this.params.term = newVal;
            this.params.subject = 0;
            this.params.keyword = '';
            
            this.errText = '';
            this.$emit('submit', this.params);
         }
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
            this.errText = '';
            this.$emit('submit', this.params);
         }else {
            if(this.params.subject) {
               if(this.params.keyword) {
                  this.params.term = 0;
                  this.params.mode = 0;

                  this.errText = '';
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