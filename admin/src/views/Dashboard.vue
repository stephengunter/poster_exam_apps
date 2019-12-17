<template>
<div>
   <core-category-selector ref="categorySelector" :all_items="allItems"
   :selected_id="category"
   @select-changed="onCategoryChanged"
   />
</div>   
</template>

<script>
import {
   FETCH_TERMS
} from '@/store/actions.type';
import { LOGIN, REFRESH_TOKEN } from '@/store/actions.type';
export default {
   name: 'Dashboard',
   methods: {
      toggle(){

      }
   },
   data() {
      return {
         allItems: [],
         category: 12
      }
   },
   computed: {

   },
   beforeMount() {
      this.$store.dispatch(FETCH_TERMS)
		.then(terms => {
         this.allItems = terms;
         setTimeout(() => {
            this.$refs.categorySelector.init();
         }, 500)
		})
		.catch(error => {
			console.error(error);
		})
   },
   methods: {
      onCategoryChanged(id) {
         console.log('onCategoryChanged', id);
      }
   }
   
}
</script>