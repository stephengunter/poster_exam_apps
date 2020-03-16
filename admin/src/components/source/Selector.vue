<template>
<div>
   <v-layout row>
		<v-flex xs12 sm6 md6>
			<v-layout row  v-for="(item, index) in sources" :key="index" >
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="onSelected(index)"> 
						{{ title }}：{{ getItemText(item) }} 
					</a>
					<a v-if="multi" v-show="item" class="ml-3" href="#" @click.prevent="onRemove(index)">
						<v-icon>mdi-window-close</v-icon>
					</a>
				</v-flex> 
			</v-layout>
			<v-layout row v-show="canCreate">
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="onAdd">
						{{ title }}：
					</a>
				</v-flex> 
			</v-layout>
		</v-flex>
      <slot>

      </slot>
   </v-layout>

   <v-dialog v-model="select.active" :max-width="select.maxWidth">
      <v-card >
         <v-card-title>
				<v-spacer />
				<a href="#" @click.prevent="closeSelect">
					<v-icon>mdi-window-close</v-icon>
				</a>
			</v-card-title>
         <v-card-text>
            <v-container>
               <v-layout row wrap>
                  <v-flex xs12>
                     <v-select label="科目"
                        :items="subjectOptions" v-model="subjectId"
                        @change="onSubjectChanged" 
                     />
                  </v-flex> 
                  <v-flex xs12>
                     <v-treeview :items="tree.items" item-children="subItems"
                     activatable hoverable return-object  active-class="primary--text"
                     :open.sync="tree.open" :active.sync="tree.active"
                     >
                        <template v-slot:label="{ item }">
                           <term-tree-item :item="item" :show_title="false" :max_width="treeMaxWidth" />
                        </template>
                     </v-treeview>
                  </v-flex>
                  <v-flex xs12 v-if="selected.term">
                     <term-read :term="selected.term" />
                     <v-data-table :items="selected.term.notes" :headers="headers"  hide-actions item-key="index">
                        <template slot="headerCell" slot-scope="{ header }">
                           <span class="subheading font-weight-light text-success text--darken-3">
                              {{ header.text }}
                           </span>
                        </template>
                        <template slot="items" slot-scope="props">
                           <td>
                              <v-checkbox primary hide-details
                              v-model="noteId" :value="props.item.id"
                              />
                           </td>
                           <td>
                              {{ props.item.title }}
                              <core-highlight v-if="props.item.text" :queries="props.item.highlights" :content="props.item.text" />
                             
                           </td>
                        </template>
                     </v-data-table>
                  </v-flex>
               </v-layout>
               <v-layout v-if="model" row wrap>
                  <v-flex sm12>
                     <v-textarea v-model="model.highlight" label="重點標記" outlined auto-grow
                     name="text"
                     rows="5"
                     row-height="15"
                     />
                     
                  </v-flex>
               </v-layout>
            </v-container>
         </v-card-text>
         <v-card-actions>
            <v-spacer />
            <v-btn :disabled="!canSubmit" 
            @click.prevent="onSubmit" color="primary"
            >
            確定
            </v-btn>
            
         </v-card-actions>
      </v-card>
   </v-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_CATEGORIES, FETCH_NOTES } from '@/store/actions.type';
import { onError } from '@/utils';
export default {
	name: 'SourceSelector',
	props: {
      sources: {
         type: Array,
         default: null
      },
      title: {
         type: String,
         default: '來源'
      },
      selected_ids: {
         type: Array,
         default: null
      },
      subject_id: {
         type: Number,
         default: 0
      },
      multi: {
         type: Boolean,
         default: true
      },
      select_default: {
         type: Boolean,
         default: false
      },
	},
	data () {
		return {
         headers: [
            {
					sortable: false,
					text: '',
               value: '',
               width: '40px'
            },
            {
					sortable: false,
					text: '內容',
               value: ''
            }
         ],

         select: {
            active: false,
            id: 0,
            index: 0,
            model: null,
            maxWidth: 480
         },

         params: {
            term: 0
         },

         noteId: 0,

         selected: {
            term: null,
            note: null
         },

         model: null,
         subjectOptions: [],
         subjectId : 0,
         subject: null,
         tree: {
            ready: false,
            items: [],
            open: [],
				active: []
			},

         selectedText: ''
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      ...mapState({
			categories: state => state.categories.list
      }),
      allSubjects() {
         if(!this.categories) return [];
         return this.categories.flatMap(item => item.subItems);
      },
      treeMaxWidth() {
			return this.contentMaxWidth - 65;
      },
      selectItem() {
         if(this.tree.active.length) return this.tree.active[0];
        
			return null;
		},
      canCreate() {
         return true;
      },
      canSubmit() {
         if(this.selected.term) return true;
         if(this.selected.note) return true;
         return false;
      }
   },
   beforeMount() {
      this.subjectId = this.subject_id;

      if(this.categories.length) {
         this.init();
         return;
      }
         
      this.$store.dispatch(FETCH_CATEGORIES, { type: 1 })
      .then(() => {
         this.$nextTick(() => {
            this.init();
         });
      })
      .catch(error => {
         onError(error);
      })
   },
   watch: {
      selectItem: 'onSelectItemChanged',
      noteId: 'onSelectNoteChanged'
   },
	methods: {
      init() {
         this.setSubject();
         this.$nextTick(() => {
            let rootsubject = this.categories.find(item => item.id === this.subject.parentId);
             this.subjectOptions = rootsubject.subItems.map(item => ({
               value: item.id, text: item.text
            }));
         })
      },
      onSubjectChanged() {
         this.setSubject();
         this.setSelectedTerm();
      },
      setSubject() {
         let subject = this.allSubjects.find(item => item.id === this.subjectId);
         this.tree.items = subject.subItems;

         this.subject = subject;
      },
      fetchNotes() {
			this.$store.dispatch(FETCH_NOTES, this.params)
			.then(terms => {
            if(terms.length) this.setSelectedTerm(terms[0]);
            else this.setSelectedTerm(null);
			})
			.catch(error => {
				onError(error);
			})
		},
		setSelectedTerm(term = null) {
         if(term) {
            this.selected.term = term;
            let noteId = this.noteId;
            this.$nextTick(() => {
               this.onSelectNoteChanged(noteId);
            });
         }else {
            this.selected.term = null;
            this.selected.note = null;
         }
      },
      onSelectItemChanged(newVal, oldVal) {
         if(!this.tree.ready) return;

         if(!newVal) {
            this.setSelectedTerm(null);
            return;
         } 
         
         let item = newVal;
        
         this.setSelectedTerm(null);
         if(item.type ==='Subject') {
         }else {
            if(this.selectItem.subItems.length) return;
            else {
               this.params.term = item.id;
               this.fetchNotes();
            }
         }
      },
      onSelected(index) {
         let model = { ...this.sources[index] };
         let highlight = model.highlights.length ? model.highlights.join('\n') : '';
         model.highlight = highlight;

         this.model = model;
         this.launchSelect(index);
      },
      launchSelect(index) {
         this.tree.ready = false;
         this.tree.open = [];
         this.tree.active = [];
        
         this.noteId = this.model.noteId;
         let termId = this.model.termId;
         if(termId) {
            for(let i = 0; i < this.tree.items.length; i++) {
               let term = this.tree.items[i];
               if(term.subItems.map(item => item.id).includes(termId)) {
                  this.tree.open.push(term);
                  this.tree.active.push(term.subItems.find(item => item.id === termId));
                  break;
               }
            }
         }

         if(this.contentMaxWidth) this.select.maxWidth = this.contentMaxWidth;
         this.select.index = index;
         this.select.active = true;

         this.$nextTick(() => {
            this.tree.ready = true;
            if(termId) {
               this.params.term = termId;
               this.fetchNotes();
            } 
         });
      },
      closeSelect() {
         this.select.active = false;
      },
      onAdd() {
         this.model = {
            termId: 0,
            noteId: 0,
            title: '',
            text: '',
            highlight: '',
            highlights: []
         };

         this.launchSelect(-1);
      },
      getItemText(item) {
         if(item.noteId) return `Note ${item.noteId}`;
         else return `Term ${item.termId}`;
      },
      onSelectNoteChanged(id) {
         if(id) {
            if(this.selected.term) {
               this.selected.note = this.selected.term.notes.find(item => item.id === id);
            }
         }else {
            this.selected.note = null;
         }
         
      },
      onRemove(index) {
         this.sources.splice(index, 1);
         this.$emit('changed');
      },
      onSubmit() {
         let model = this.model;
         let highlight = model.highlight;
         model.highlights = highlight.split('\n').filter(Boolean);

         if(this.selected.note) {
            let note = this.selected.note;
            model.noteId = note.id;
            model.termId = note.termId;
            model.title = note.title;
            model.text = note.text;
         }else {
            let term = this.selected.term;
            model.noteId = 0;
            model.termId = this.selected.term.id;
            model.title = term.title;
            model.text = term.text;
         }
        
         this.setSelectedItem({ ...model });
         this.closeSelect();
      },
      setSelectedItem(item) {
         let selectingIndex = this.select.index;

			if(selectingIndex < 0) {
				//新增
            this.sources.push(item);
            
			}else {
            this.sources.splice(selectingIndex, 1, item);
         }

         this.$emit('changed');
      }
	}
}
</script>
