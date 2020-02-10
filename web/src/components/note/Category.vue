<template>
   <v-card>
      <v-card-title>
         <h3>目錄 - 請選擇章節</h3>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="12" md="8">
               <v-select label="科目"
                  :items="subject_options" v-model="params.rootSubject"
                  @change="onSubjectChanged"
               />
            </v-col>
            <v-col cols="12" md="4" v-show="canSearch" >
               <form @submit.prevent="search">
                  <v-text-field label="" single-line hide-details
                  v-model="params.keyword"
                  >
                     <template v-slot:prepend>
                        <a href="#" @click.prevent="search" class="a-btn">
                           <v-icon>mdi-magnify</v-icon>
                        </a>
                     </template>
                     <template v-slot:append>
                        <a href="#" @click.prevent="clearSearch" class="a-btn">
                           <v-icon>mdi-close</v-icon>
                        </a>
                     </template>
                  </v-text-field>
               </form>
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
         tree: {
				active: []
			},
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
      selectItem: 'onSelectItemChanged'
   },
	methods: {
      onSubjectChanged() {
         this.$emit('root-changed');
      },
      onSelectItemChanged(newVal, oldVal) {
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
         this.$emit('params-changed', this.params);
      },
      search() {
         if(this.params.keyword) {
            this.params.term = 0;
            this.$emit('params-changed', this.params);
         }
      },
      clearSearch() {
			this.params.keyword = '';
		}
	}
}
</script>

<style>

</style>