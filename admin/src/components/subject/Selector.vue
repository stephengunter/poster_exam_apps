<template>
   <v-layout row wrap>   
      <v-flex v-for="(item, index) in models" :key="index" :class="colStyle">
         <v-select
            :items="models[index].options"  :label="getLabel(index)"
            v-model="models[index].id" @change="onChanged(index, models[index].id)"
         />
      </v-flex>
      
      <v-flex :class="btnColStyle">
         <slot></slot>
      </v-flex>
   </v-layout>
    
	
</template>

<script>

export default {
   name: 'SubjectSelector',
   props: {
		items: {
         type: Array,
         default: null
      },
      selected: {
         type: Number,
         default: 0
      }
   },
	data () {
		return {
         models: []
		}
   },
   computed: {
      lastIndex(){
         return this.models.length - 1;
      },
      colStyle(){
         if(this.models.length < 3) return 'xs12 sm4 md4';
         return 'xs12 sm3 md3';
      },
      btnColStyle(){
         return `text-lg-right ${this.colStyle}`;
      }
   },
	methods: {
      init(){
         this.loadOptions(this.items, this.selected);
      },
		loadOptions(subjects, id){
         let options = subjects.map(item => {
            return { value: item.id, text: item.title }
         });
         let items = subjects.slice(0);

         let model = null;
         if(id) model = subjects.find(item => item.id === id);
         else{
            model = subjects[0];
            id = model.id;
         } 

         this.models.push({
            model, items, options, id
         });
         

         if(model.subItems && model.subItems.length) this.loadOptions(model.subItems);
         else this.onOptionsLoaded();

      },
      getLabel(index){
         if(index) return '';
         return '科目';         
      },
      getSelectedId(){
         return this.models[this.lastIndex].id;
      },
      onOptionsLoaded(){
         this.$emit('selected', this.getSelectedId());
      },
      onChanged(index, id){
         let items = this.models[index].items.slice(0);
         this.models.splice(index);
         this.loadOptions(items, id);   
      }
	}
}
</script>