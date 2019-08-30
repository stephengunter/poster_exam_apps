<template>
	<v-layout row wrap>
      <v-flex v-for="(item, index) in displayModels" :key="index" xs12 sm3 md3 >
         <v-select
            :items="models[index].options"  :label="getLabel(index)"
            v-model="models[index].id" @change="onChanged(index)"
         />
      </v-flex>
   </v-layout>
    
	
</template>

<script>

export default {
   name: 'TermSelector',
   props: {
		items: {
         type: Array,
         default: null
      },
      selected: {
         type: Number,
         default: 0
      },
      hide_last: {
         type: Boolean,
         default: true
      }
   },
	data () {
		return {
         models: []
		}
   },
   computed: {
      displayModels(){
         if(this.models.length > 1) return  this.models.slice(0, this.lastIndex + 1);
         return this.models.slice(0);
      },
      lastIndex(){
         if(this.hide_last) return this.models.length >= 2 ? this.models.length - 2 : 0;
         return this.models.length - 1;
      }
   },
	methods: {
      init(){
         this.loadOptions(this.items, this.selected);
      },
		loadOptions(terms, id){
         let options = terms.map(item => {
            return { value: item.id, text: item.fullText }
         });

         options.splice(0, 0, { value: 0, text: '------------'  });

         let model = null;
         if(id) model = terms.find(item => item.id === id);
         else id = 0;

         this.models.push({
            model, options, id
         });

         if(model && model.subItems && model.subItems.length) this.loadOptions(model.subItems, id);      
         else this.onChanged(this.lastIndex);
      },
      getLabel(index){
         if(index) return '';
         return '章節';
      },
      getSelectedId(){
         return this.models[this.lastIndex].id;
      },
      onChanged(index){
         if(index === this.lastIndex){
            this.$emit('selected', this.getSelectedId());
         }
      }
	}
}
</script>