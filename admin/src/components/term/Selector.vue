<template>
<div>
   <v-layout row>
		<v-flex xs12 sm6 md6>
			<v-layout row  v-for="(item, index) in selected.terms" :key="index" >
				<v-flex>
					<a href="#" class="text-truncate" @click.prevent="onSelected(index)"> 
						{{ title }}：{{ selected.textList[index] }} 
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
      <v-card>
         <v-card-title>
            <span class="headline">選擇{{ title }}</span>
            <v-spacer />
            <a href="#" @click.prevent="closeSelect">
               <v-icon>mdi-window-close</v-icon>
            </a>
         </v-card-title>
         <v-card-text>
            <v-container>
               <core-category-selector ref="categorySelector" :title="title"
               :all_items="termList" :selected_id="select.id"
               :select_default="select_default"
               @select-changed="onTermChanged"
               />
               <v-layout v-if="select.model" row wrap>
                  <v-flex sm12>
                     <div v-html="select.model.fullText">

                     </div>
                     
                  </v-flex>
               </v-layout>
            </v-container>
         </v-card-text>
         <v-card-actions>
            <v-spacer />
            <v-btn @click.prevent="onTermSelected" color="primary">確定</v-btn>
            
         </v-card-actions>
      </v-card>
   </v-dialog>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_TERMS } from '@/store/actions.type';
import { onError } from '@/utils';
export default {
	name: 'TermSelector',
	props: {
      title: {
         type: String,
         default: '條文'
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
         default: false
      },
      select_default: {
         type: Boolean,
         default: false
      },
	},
	data () {
		return {
         termList: [],

         select: {
            active: false,
            id: 0,
            index: 0,
            model: null,
            maxWidth: 480
         },

         selected: {
            terms: [],
            textList: [],
            ids: [],
            idsText: ''
         }
		}
   },
   computed: {
      ...mapGetters(['responsive','contentMaxWidth']),
      canCreate() {
         if(this.selected.ids.length) return this.multi;
         return true;
      }
   },
	methods: {
      init() {
         if(this.selected_ids) this.fetchTerms(this.selected_ids);
         else this.fetchTerms([0]);
      },
      fetchTerms(selectedIds){
         let subject = this.subject_id;
			let parent = -1;
			let subItems = false;
			
			this.$store.dispatch(FETCH_TERMS, { subject, parent, subItems })
			.then(terms => {
            this.termList = terms;
            this.$nextTick(() => {
               selectedIds.forEach(id => {
                  let item = this.$refs.categorySelector.loadSelectedItem(id);
                  let text = this.$refs.categorySelector.getSelectedListText();
                  this.select.index = -1;
                  this.setSelectedItem({ item, text });
               })

               this.submit();
            })
			})
			.catch(error => {
				onError(error);
			})
		},
		submit(){
         this.selected.idsText = this.selected.ids ? this.selected.ids.join() : '';

         this.$emit('submit', this.selected);
         
      },
      onSelected(index) {
         this.select.id = this.selected.ids[index];
         this.$nextTick(() => {
            this.$refs.categorySelector.init();
            this.launchSelect(index);
         })
      },
      launchSelect(index) {
         if(this.contentMaxWidth) this.select.maxWidth = this.contentMaxWidth;
         this.select.index = index;
         this.select.model = null;
         this.select.active = true;
      },
      closeSelect() {
         this.select.id = 0;
         this.select.active = false;
         this.select.model = null;
      },
      onAdd() {
         this.select.id = 0;   
         this.$refs.categorySelector.init();
         this.launchSelect(-1);
      },
      onRemove(index) {
         this.selected.ids.splice(index, 1);
         this.selected.terms.splice(index, 1);
         this.selected.textList.splice(index, 1);

         this.submit();
      },
      setSelectedItem({ item, text }) {
         let selectingIndex = this.select.index;

			if(selectingIndex < 0) {
				//新增
            if(!item) return;
            if(this.selected.ids.includes(item.id)) return;

            this.selected.terms.push(item);
            this.selected.ids.push(item.id);
            this.selected.textList.push(text);
            
			}else {
            if(!item) return;
            if(this.selected.ids.includes(item.id)) return;
            
            this.selected.terms.splice(selectingIndex, 1, item);
            this.selected.ids.splice(selectingIndex, 1, item.id);
            this.selected.textList.splice(selectingIndex, 1, text);

         }
      },
      onTermChanged(item) {
         this.select.model = item;
      },
      onTermSelected() {
         let item = { ...this.select.model };
         let text = this.$refs.categorySelector.getSelectedListText();
         this.setSelectedItem({ item, text });

         this.submit();
         this.closeSelect();
      }
	}
}
</script>
