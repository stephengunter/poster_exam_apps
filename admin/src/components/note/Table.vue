<template>
   <v-data-table :items="notes" :headers="headers"  hide-actions item-key="index">
      <template slot="headerCell" slot-scope="{ header }">
         <span class="subheading font-weight-light text-success text--darken-3">
            {{ header.text }}
         </span>
      </template>
      <template slot="items" slot-scope="props">
         <note-row :model="props.item" :index="props.index" :key="props.item.id"
         :enable="enable(props.item, props.index)" :edit="isEdit(props.item, props.index)"
         @selected="edit" @cancel="onRowCancel"
         @show-photo="showPhoto" 
         @save="onSubmit(props.item)" @remove="onRemove(props.item)"
         />
      </template>
   </v-data-table>
</template>


<script>
export default {
	name: 'NoteTable',
	props: {
      notes: {
         type: Array,
         default: null
      },
      seleted_index: {
         type: Number,
         default: -1
      },
      editting: {
         type: Boolean,
         default: false
      },
      creating: {
         type: Boolean,
         default: false
      }

	},
	data () {
		return {
			headers: [
            {
					sortable: false,
					text: 'Id',
               value: '',
               width: '30px'
            },
            {
					sortable: false,
					text: 'TermId',
               value: '',
               width: '30px'
            },
            {
					sortable: false,
					text: 'Active',
               value: '',
               width: '50px'
            },
            {
					sortable: false,
					text: '重要',
               value: '',
               width: '50px'
            },
            {
					sortable: false,
					text: '附圖',
               value: '',
               width: '15%'
            },
            {
					sortable: false,
					text: '標題',
               value: '',
               width: '15%'
            },
				{
					sortable: false,
					text: '內容',
               value: '',
               width: '35%'
            },
            {
					sortable: false,
					text: '重點標記',
               width: '15%'
            },
            {
					sortable: false,
					text: '參考',
               width: '15%'
            },
            {
					sortable: false,
					text: '',
					width: '5%'
				}
         ]
		}
   },
	methods: {
      edit(index, model) {
         this.$emit('edit', index, model);
      },
      onRowCancel() {
         this.$emit('row-canceled');         
      },
		onRemove(item){
         this.$emit('remove', item);
      },
      onSubmit(model) {
         this.$emit('submit', model);
      },
      showPhoto(photo){
         this.$emit('show-photo', photo);
      },
      isEdit(item, index) {
         if(!item.id) return true;
         return index === this.seleted_index;
      },
      enable(item, index) {
         if(item.id) {
            if(this.creating)  return false;
            else if(this.editting) return index === this.seleted_index;
            return true
         }
         return true
      }      
	}
}
</script>
