<template>
   <v-layout v-if="ready" row wrap>
      <v-flex v-for="(item, index) in models" :key="index" xs12 sm3 md3 >
         <v-select
            :items="models[index].options" v-model="models[index].selectedId"
            @change="onChanged(index)"
         />
      </v-flex>
   </v-layout>
</template>

<script>
export default {
   name: 'CategorySelector',
   props: {
		allow_empty: {
         type: Boolean,
         default: true
      },
      empty_text: {
         type: String,
         default: '全部'
      },
      all_items: {
         type: Array,
         default: null
      },
      selected_id: {
         type: Number,
         default: 0
      },
   },
   data () {
		return {
         ready: false,
         rootItems: [],
         models: [],
         selected: {
            item: null,
            idList: []
         }
      }
   },
   computed: {
      
   },
   methods: {
      init() {
         this.rootItems = this.getRootItems();
         let selectedItem = this.getSelectedItem(this.selected_id);
         
         if(selectedItem) {
            this.selected.item = selectedItem;
            let parentList = this.getParentList(selectedItem);

            let models = this.getModels(selectedItem.id, -1);
            this.setModels(models);

            this.ready = true;
         }else {
            this.selected.item = this.rootItems.length ? this.rootItems[0] : null;

            let models = this.getModels(this.selected_id, -1);
            this.setModels(models);

            this.ready = true;
         }

         

         //this.selected.idList = this.getSelectedIdList();
      },
      getRootItems() {
         if(this.all_items) return this.all_items.filter(item => item.isRootItem);
         return [];
      },
		getSelectedItem(id) {
         if(id) return this.all_items.find(item => item.id === id);
         return null;
      },
      getModels(selectedId , idx) {
         //從前到後
         let models = [];
         let items = idx < 0 ? this.rootItems.slice(0) : this.getSubItems(selectedId);

         while (items && items.length) {
            
            selectedId = items[0].id;
            models.push({
               selectedId, items
            });

            items = this.getSubItems(selectedId);
         }

         return models;
      },
      // loadModels(parentId) {
      //    //從後到前
      //    let models = [];
      //    while (parentId) {
      //       let parent = this.getParent(parentId);
      //       let selectedId = parent.id;

      //       parentId = parent.parentId;
      //       let items = this.getSubItems(parent.parentId);

      //       models.push({
      //          selectedId, items
      //       });
      //    }
      //    return models;
      // },
      setModels(models, idx = 0) {
         for(let i = 0; i < models.length; i++) {
            models[i].options = models[i].items.map(item => {
               return { value: item.id, text: item.title }
            })
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
      getSelectedIdList() {
         return this.models.map(item => item.selectedId);
      },
      getSubItems(parentId) {
         return this.all_items.filter(item => item.parentId === parentId);
      },
      getItemById(id) {
         return this.all_items.find(item => item.id === id);
      },
      getParentList(selectedItem) {
         let parentList = [];
         let parentItem = this.getItemById(selectedItem.parentId);
         while (parentItem) {

            parentList.push(parentItem);
            parentItem = this.getItemById(parentItem.parentId);
         }

         return parentList.length ? parentList.reverse() : [];
      },
      onChanged(index){
         let selectedId = this.models[index].selectedId;
         let models = this.getModels(selectedId, index);
         this.setModels(models, index + 1);

         let model = this.models[this.models.length - 1];
         this.$emit('select-changed', model.selectedId);
      },

   }
   
}
</script>

