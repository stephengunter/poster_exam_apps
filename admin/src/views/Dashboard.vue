<template>
<div>
   <table class="custom-table">
      <tr>
         <th></th>
         <th>臨時停車</th>
         <th>停車</th>
      </tr>
      <tr>
         <td>汽車</td>
         <td>距離路面邊緣60公分內(大型車為1公尺內)</td>
         <td>距離路面邊緣40公分內</td>
      </tr>
      <tr>
         <td>機車</td>
         <td>距離路面邊緣40公分內</td>
         <td>距離路面邊緣30公分內</td>
      </tr>
   </table>
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
