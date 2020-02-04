<template>
<div>
  <a href="#" onclick="event.preventDefault(); showTerm(5);" >click</a>
</div>
</template>

<script>
export default {
   name: 'Dashboard',
   data() {
      return {
         
      }
   },
   computed: {
		canCreate(){
			return true;
		},
   },
   beforeMount(){
      
   },
   methods: {
      init() {

      },
   }
   
}
</script>
