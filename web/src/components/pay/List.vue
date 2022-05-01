<template>
   <v-simple-table>
      <template v-slot:default>
         <thead>
            <tr>
               <th style="width:25%">金額</th>
               <th style="width:35%">付款方式</th>
               <th>付款日期</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="(item, index) in list" :key="index">
               <td>
                  <span class="mr-1">$</span>
                  <span style="font-size: 1.2em;">{{ item.money }}</span>
               </td>
               <td>
                  {{ item.payWayTitle }}
               </td>
               <td>
                  {{ item.createdAtText }}
               </td>
            </tr>
         </tbody>
      </template>
   </v-simple-table>
</template>

<script>

export default {
   name: 'PayList',
   props: {
      list: {
         type: Array,
         default: null
      }
   },
   data() {
		return {
			
		}
   }
}
</script>