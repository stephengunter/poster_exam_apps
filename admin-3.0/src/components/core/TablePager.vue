<template>
   <v-row v-if="can_page">
      <v-col cols="12" class="text-center">
         <v-select v-if="!responsive"  class="d-inline-flex" style="width:60px"
         label="Rows"
         :items="row_options" v-model="size" 
         @change="onPageSizeChanged"
         />

         <span class="ml-3 mr-3" v-text="summary">
         </span>

         <v-pagination  class="d-inline-flex"
         v-model="page"
         :length="model.totalPages"
         :total-visible="responsive ? 3 : 7"
         @input="onPageChanged"
         />
      </v-col>
   </v-row>
   <v-row v-else>
      <v-col cols="12">
         <span class="ml-3 mr-3" v-text="summary">
         </span>
      </v-col>
   </v-row>
</template>

<script>
export default {
   name: 'TablePager',
   props: {
      model: {
         type: Object,
         default: null
      },
      list_key: {
         type: String,
         default: 'viewList'
      },
      can_page: {
         type: Boolean,
         default: true
      },
      row_options: {
         type: Array,
         default: () => [10,25,50]
      },
      responsive: {
         type: Boolean,
         default: false
      }
   },
   data () {
		return {
         page: 1,
         size: 10,
      }
   },
   watch: {
      model:{
         handler() {
            this.init();
         },
         deep: true
      }
   },
   beforeMount(){
      this.init();
   },
   computed:{
		first() {
         if(!this.model) return 0;
         if(!this.model.totalItems) return 0;
			return this.model.pageSize * (this.model.pageNumber - 1) + 1;			
		},
		last() {
         if(!this.model) return 0;
         if(!this.model.totalItems) return 0;
			return this.first + this.model[this.list_key].length - 1;
      },
      summary() {
         return `${this.first} - ${this.last} of ${this.model.totalItems}`;
      }
	},   
   methods:{
      init() {
         this.page = this.model.pageNumber;
         this.size = this.model.pageSize;
      },
      onPageChanged() {
         this.$emit('pageChanged', this.page);
		},      
		onPageSizeChanged() {
			this.$emit('sizeChanged', this.size);
		}
	}
}
</script>

