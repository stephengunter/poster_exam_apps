<template>
   <v-card>
      <v-card-title>
         <h3>目錄 - 請選擇章節</h3>
         <v-spacer />
         <a v-if="allow_cancel" href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-layout row wrap>
            <v-flex xs6 sm6 md6>
               <v-select label="科目"
                  :items="subject_options" v-model="params.subject"
                  @change="onSubjectChanged"
               />
            </v-flex>
            <v-flex xs6 sm6 md6>
            </v-flex>
         </v-layout>
         <v-layout row wrap>
            <v-flex xs12>
               <v-treeview v-if="trees && trees.length" :items="trees" item-children="subItems"
               open-all activatable hoverable return-object  active-class="primary--text"
               :active.sync="tree.active"
               >
                  <template v-slot:label="{ item }">
                     <term-tree-item :item="item" :max_width="treeMaxWidth" />
                  </template>
               </v-treeview>
            </v-flex>
         </v-layout>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   props: {
      subject_options: {
         type: Array,
			default: null
      },
      allow_cancel: {
         type: Boolean,
			default: false
      },
      trees: {
         type: Array,
			default: null
      },
      params: {
			type: Object,
			default: null
		}
   },
   data () {
      return {
         subject: {
				options: [],
				root: null,
				subItems: []
         },

         tree: {
				active: []
			}
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
		}
   },
   watch: {
      selectItem: 'onSelectItemChanged'
   },
   beforeMount(){
		
   },
   methods: {
      init() {
         
      },
      onSubjectChanged(val) {
         this.$emit('subject-changed', val);
      },
      onSelectItemChanged() {
         if(!this.selectItem) return;

         let item = this.selectItem;
         if(item.type && item.type === 'subject') {
            return;
         }else {
            if(item.id !== this.params.term) {
               this.params.term = item.id;
               this.$emit('selected', item);
            }
         }
		},
      cancel() {
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>