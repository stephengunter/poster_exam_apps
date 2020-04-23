<template>
   <v-simple-table>
      <template v-slot:default>
         <thead >
            <tr v-if="hasData">
               <th>有效期限</th>
               <th>金額</th>
               <th>狀態</th>
            </tr>
            <tr v-else>
               <th>查無資料</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="(model, index) in list" :key="index">
               <td>
                  {{ periodText(model) }}
               </td>
               <td>
                  <div class="item-price">
                     <span class="mr-1">$</span>
                     <span class="price-number">{{ model.price }}</span>
                     <v-chip v-show="model.hasDiscount" color="warning"  class="ml-3 mb-2" small>
                     優惠價
                     </v-chip>
                  </div>
               </td>
               <td>
                  <v-chip small>
                     已結束
                  </v-chip>
               </td>
            </tr>
         </tbody>
      </template>
   </v-simple-table>
</template>

<script>
export default {
   name: 'SubscribesTable',
   props: {
      list: {
         type: Array,
         default: null
      }
   },
   computed: {
      hasData() {
         if(this.list && this.list.length) return true;
         return false;
      }
   },
   methods: {
      periodText(model) {
         let start = getPlanStartDateText(model);
         let end = getPlanEndDateText(model)

         return `${start} 至 ${end} 止`;
      }
   }
}
</script>

<style>

</style>