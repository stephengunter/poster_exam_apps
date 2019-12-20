<template>
   <v-layout v-if="ready" row wrap>
      <v-flex v-for="(item, index) in models" :key="index" xs12 sm3 md3 >
         <v-select style="margin-right:10px" :label="index < 1 ? title : ''"
            :items="models[index].options" v-model="models[index].selectedId"
            @change="onChanged(index)" v-show="index <= selected.index + 1"
         />
      </v-flex>
   </v-layout>
</template>

<script>
export default {
   name: 'CategorySelector',
   props: {
      title: {
         type: String,
         default: ''
      },
		allow_empty: {
         type: Boolean,
         default: true
      },
      empty_text: {
         type: String,
         default: '--------'
      },
      select_default: {
         type: Boolean,
         default: true
      },
      all_items: {
         type: Array,
         default: null
      },
      selected_id: {
         type: Number,
         default: 0
      }
   },
   data () {
		return {
         ready: false,
         models: [],
         selected: {
            index: 0,
            item: null,
            idList: []
         }
      }
   },
   computed: {
      
   },
   beforeMount(){
		
	},
   methods: {
      init() {
         let selectedItem = this.getItemById(this.selected_id);
         if(selectedItem) {
            
            let parentId = selectedItem.parentId;
            let parentModels = this.getParentModelList(selectedItem);

            let startIndex = parentModels.length;
            if(parentModels.length) parentId = parentModels[parentModels.length - 1].selectedId;
            else parentId = 0;

            let selectedIds = [selectedItem.id];
            let models = this.getModels(startIndex , parentId, selectedIds);

            this.setModels(parentModels.concat(models));

            // startIndex 等於 selected index
            this.setSelectedItem(selectedItem, startIndex);
            this.setSelectedIdList();
            this.ready = true;
         }else {
            let models = this.getModels();
            this.setModels(models);

            if(this.select_default) {
               selectedItem = models.length ? models[0].items[0] : null;

               if(selectedItem) {
                  this.models[0].selectedId = selectedItem.id;
                  this.setSelectedItem(selectedItem, 0);
               }else this.setSelectedItem(null, -1);           
               
            }else {
               this.setSelectedItem(null, -1);
            }

            this.setSelectedIdList();
            this.ready = true;
         }

         this.$emit('select-changed', selectedItem);

      },
      getSelectedListText(splitText = ' > ') {
         let ids = this.selected.idList;
         if(!ids) return '';

         let text = '';
         for(let i = 0; i < ids.length; i++) {
            if(i > 0) text += splitText;
            let item = this.getItemById(ids[i]);
            text += item.title;
         }
         return text;
      },
      getSelectedItem() {
         return this.selected.item;
      },
      setSelectedItem(item, index) {
         this.selected.item = item;
         this.selected.index = index;
      },
      getSelectedItemList() {
         let ids = this.selected.idList;
         let items = [];
         for(let i = 0; i < ids.length; i++) {
            let id = this.selected.idList[i];
            let item = this.getItemById(id);
            items.push(item);
         }
         return items;
      },
      setSelectedIdList() {
         let ids = [];
         for(let i = 0; i < this.models.length; i++) {
            let selectedId = this.models[i].selectedId;
            if(selectedId) ids.push(selectedId);
         }
         this.selected.idList = ids;
      },
      getModels(startIndex = 0, parentId = 0, selectedIds = []) {
         //從前到後
         let i = 0;
         let models = [];
         let hasSubItems = true;

         do {
            let items = this.getSubItems(parentId);

            if(items && items.length) hasSubItems = true;
            else hasSubItems = false;
            
            let selectedId = 0;
            if(selectedIds[i]) selectedId = selectedIds[i];

            if(selectedId) parentId = selectedId;
            else parentId = hasSubItems ? items[0].id : 0;

            if(hasSubItems) {
               models.push({
                  selectedId, items
               });
            }

            i++;
         } while (hasSubItems);

         return models;
      },
      loadModels(parentId) {
         //從後到前
         let models = [];
         while (parentId) {
            let parent = this.getItemById(parentId);
            let selectedId = parent.id;

            parentId = parent.parentId;
            let items = this.getSubItems(parent.parentId);

            models.push({
               selectedId, items
            });
         }
         return models;
      },
      setModels(models, idx = 0) {
         for(let i = 0; i < models.length; i++) {
            models[i].options = models[i].items.map(item => {
               return { value: item.id, text: item.title }
            })

            if(this.allow_empty) {
               models[i].options.unshift({
                  value: 0, text: this.empty_text
               });
            }
            
         }

         if(idx === 0) this.models = models;
         else {
            let correctLength = idx + models.length;
            if(correctLength > this.models.length) {
               for(let i = 0; i < models.length; i++) {
                  if(idx >= this.models.length) {
                     this.models.push(models[i]);
                  }else {
                     this.models.splice(idx, 1, models[i]);
                  }
                  idx += 1;
               }
            }else {
               let needRemove = this.models.length - correctLength;
               if(needRemove) {
                  this.models.splice(correctLength, needRemove);
               }

               for(let i = 0; i < models.length; i++) {
                  this.models.splice(idx, 1, models[i]);
                  idx += 1;
               }
               
            }
         }
      },
      getSubItems(parentId) {
         return this.all_items.filter(item => item.parentId === parentId);
      },
      getItemById(id) {
         if(id) return this.all_items.find(item => item.id === id);
         return null;
      },
      getParentModelList(selectedItem) {
         let models = [];
         let parentItem = this.getItemById(selectedItem.parentId);
         while (parentItem) {
            let selectedId = parentItem.id;
            let items = this.getSubItems(parentItem.parentId);
            models.push({
               selectedId, items
            });
            parentItem = this.getItemById(parentItem.parentId);
         }

         return models.length ? models.reverse() : [];
      },
      onChanged(index){
        
         let selectedItem = null;
         let selectedId = this.models[index].selectedId;
         if(!selectedId) {
            //往上層找, 直到選的不是0
            for(let i = index; i >= 0; i--) {
               if(this.models[i].selectedId) {
                  selectedId = this.models[i].selectedId;
                  index = i;
                  break;
               }
            }
         }
           
         if(!selectedId) index = -1; //沒有一個選中

         selectedItem = this.getItemById(selectedId);
         this.setSelectedItem(selectedItem, index);

        
         let models = this.getModels(index, selectedId);
         this.setModels(models, index + 1);

         this.setSelectedIdList();         
        
         this.$emit('select-changed', selectedItem);
      },

   }
   
}
</script>

