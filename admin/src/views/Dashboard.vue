<template>
   <div>

      

   </div>
  
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
   data () {
      return {
         
      }
   },
   computed: {
		...mapGetters(['currentUser'])
	},
   beforeMount() {
      console.log(this.currentUser);
		
   },
   methods: {
      test() {
         
      },
      fetchData() {
         
      }
   }
}
</script>