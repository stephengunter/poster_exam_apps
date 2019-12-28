<template>
<div>
   Dashboard
</div>   
</template>

<script>
export default {
   name: 'Dashboard',
   methods: {
      toggle(){

      }
   },
   data() {
      return {
         allItems: [],
         category: 0
      }
   },
   computed: {

   },
   beforeMount() {
      
   },
   methods: {
      onCategoryChanged(item) {
         console.log('onCategoryChanged', item);
      }
   }
   
}
</script>