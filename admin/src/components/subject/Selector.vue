<template>
	<!-- <v-layout row wrap> -->
   <v-layout row wrap>   
      <v-flex v-for="(item, index) in models" :key="index" :class="colStyle">
         <v-select
            :items="models[index].options"  :label="getLabel(index)"
            v-model="models[index].id" @change="onChanged(index)"
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
         this.loadOptions(this.items);
      },
		loadOptions(subjects, id){
         let options = subjects.map(item => {
            return { value: item.id, text: item.title }
         });

         let model = null;
         if(id) model = subjects.find(item => item.id === id);
         else{
            model = subjects[0];
            id = model.id;
         } 

         this.models.push({
            model, options, id
         });
         

         if(model.subItems && model.subItems.length) this.loadOptions(model.subItems);
         else this.onChanged(this.lastIndex);

      },
      getLabel(index){
         if(index) return '';
         return '科目';         
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