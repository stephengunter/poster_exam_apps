<template>
   <v-card>
      <v-card-title>
         <h3>目錄 - 請選擇章節</h3>
         <v-spacer />
         <a v-show="paramsValid" href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-layout row wrap>
            <v-flex xs6 sm6 md6>
               <v-select label="科目"
                  :items="subjectOptions" v-model="params.rootSubject"
                  @change="onSubjectChanged"
               />
            </v-flex>
            <v-flex xs6 sm6 md6>
               <form v-show="canSearch" @submit.prevent="search">
                  <v-text-field label="Search" single-line hide-details
                  v-model="params.keyword"
                  >
                     <template v-slot:prepend>
                        <v-icon>mdi-magnify</v-icon>
                     </template>
                     <template v-slot:append>
                        <a href="#" @click.prevent="clearSearch">
                           <v-icon>mdi-close</v-icon>
                        </a>
                     </template>
                  </v-text-field>
               </form>
            </v-flex>
         </v-layout>
         <v-layout row wrap>
            <v-flex xs12>
               <v-treeview :items="tree.items" item-children="subItems"
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
import { FETCH_CATEGORIES } from '@/store/actions.type';
import { onError } from '@/utils';

export default {
   data () {
      return {
         subjectOptions: [],
         params: {
				rootSubject: 0,
				subject: 0,
            term: 0,
            keyword: '',
         },
         tree: {
            items: [],
				active: []
			}
      }
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      ...mapState({
			categories: state => state.categories.list
      }),
      paramsValid() {
         return this.params.subject > 0 || this.params.term > 0
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
      selectItem: 'onSelectItemChanged'
   },
   beforeMount() {
      if(this.categories.length) return;
      this.$store.dispatch(FETCH_CATEGORIES)
      .then(() => {
         this.$nextTick(() => {
            this.init();
         });
      })
      .catch(error => {
         onError(error);
      })
   },
   methods: {
      init() {
         let subjectOptions = this.categories.map(item => ({ value: item.id, text: item.text }));
         this.params.rootSubject = subjectOptions[0].value;
         this.setTreeItems();

         this.subjectOptions = subjectOptions;
         this.$emit('ready');
      },
      setTreeItems() {
         let rootSubjectId = this.params.rootSubject;
         let category = this.categories.find(item => item.id === rootSubjectId);

         this.tree.items = category.subItems;
      },
      onSubjectChanged() {
         this.setTreeItems();
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
		},
      cancel() {
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>