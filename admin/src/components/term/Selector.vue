<template>
	<v-layout row wrap>
      <v-flex v-for="(item, index) in displayModels" :key="index" xs12 sm3 md3 >
         <v-select
            :items="models[index].options"  :label="getLabel(index)"
            v-model="models[index].id" @change="onChanged(index)"
         />
      </v-flex>
     
      <v-flex v-if="show_last" v-show="parent" xs12 sm3 md3>
         <v-btn v-if="selectedItem && selectedItem.model" flat  @click.prevent="launchSelecteTable" color="primary">
            {{ selectedItem.model.title }}
         </v-btn>
         <v-btn v-if="selectedItem && selectedItem.id" @click.prevent="onTableSelected(0)" flat icon>
            <v-icon>mdi-close</v-icon>
         </v-btn>
      </v-flex>
      <v-dialog v-model="selectTable.show" max-width="600px">
         <term-table :list="selectTable.list" @selected="onTableSelected"/>
      </v-dialog>
     
   </v-layout>
    
	
</template>

<script>

const findSelectedId = (selectedIds, index) => {
   if(!selectedIds) return 0;
   if(!selectedIds[index]) return 0;
   return selectedIds[index];
}
const getSubItems = (model) => {
   if(model && model.subItems && model.subItems.length) return model.subItems;
   return [];
}

export default {
   name: 'TermSelector',
   props: {
		items: {
         type: Array,
         default: null
      },
      selected_ids: {
         type: Array,
         default: null
      },
      allow_empty: {
         type: Boolean,
         default: false
      },
      show_last: {
         type: Boolean,
         default: false
      },
      want_array: {
         type: Boolean,
         default: true
      },
      empty_text: {
         type: String,
         default: '-----------'
      }
   },
	data () {
		return {
         models: [],        
         selectTable:{
            show: false,
            list: []
         },

         displayModels:[],
         parent: null,
         selectedItem: null
		}
   },
   computed: {
      lastIndex(){
         return this.models.length >= 1 ? this.models.length - 1 : 0;
      }
   },
	methods: {
      init(){
         this.models = [],
         this.selectTable.show = false;
         this.selectTable.list = [];

         if(this.selected_ids){
            for(let i = 0; i < this.selected_ids.length; i++){
               this.models.push({ id: this.selected_ids[i] });
            }
         }

         this.loadOptions(this.items, this.selected_ids);
      },
      loadOptions(terms, selectedIds, index = 0){
         let id = findSelectedId(selectedIds, index);
         
         let options = terms.map(item => {
            return { value: item.id, text: item.fullText }
         });
         options.splice(0, 0, { value: 0, text: this.empty_text  });

         let items = terms.slice(0);

         let model = null;
         if(id) model = terms.find(item => item.id === id);
         if(!model){
            id = 0;
            model = { title: this.empty_text };
         }

         if(this.models[index]){
            this.models[index] = { model, items, options, id };
         }else{
            this.models.push({ model, items, options, id });
         }

         index ++;

         let subItems = getSubItems(model);
         if(subItems.length) this.loadOptions(subItems, this.getSelectedIds(), index);      
         else this.onOptionsLoaded();
      },
      onOptionsLoaded(){
         this.setSelectedItem();
         this.setParent();
         this.setDisplayModels();

         if(this.want_array) this.$emit('selected', this.getSelectedIds());
         else this.$emit('selected', this.getSelectedId());
      },
      setSelectedItem(){
         this.selectedItem = this.models[this.lastIndex] ? this.models[this.lastIndex] : null;
      },
      setParent(){
         this.parent = this.models.length ? this.models[this.lastIndex - 1] : null;
      },
      setDisplayModels(){
         this.displayModels = this.models.length > 1 ? this.models.slice(0, this.lastIndex) : this.models.slice(0);
      },
      getSelectedId(){
         if(this.selectedItem && this.selectedItem.id) return this.selectedItem.id;
         if(this.parent && this.parent.id) return this.parent.id;
         return 0;
      },
      getSelectedIds(){
         return this.models.map(item => item.id);
      },
      getLabel(index){
         if(index) return '';
         return '章節';
      },
      onChanged(index, id){
         let selectedIds = this.getSelectedIds();
         let items = this.models[index].items.slice(0);
         this.models.splice(index);
         
         this.loadOptions(items, selectedIds, index);   
      },
      launchSelecteTable(){
         let items = this.selectedItem.items.slice(0);
         this.selectTable.list = items;
         this.selectTable.show = true;         
      },
      onTableSelected(id){
         this.models[this.lastIndex].id = id;
         this.onChanged(this.lastIndex, id);

         this.selectTable.show = false;
      }
	}
}
</script>