<template>
   <v-simple-table>
      <template v-slot:default>
         <thead >
            <tr v-if="hasData">
               <th style="width:25%">金額</th>
               <th style="width:25%">狀態</th>
               <th>有效期間</th>
            </tr>
            <tr v-else>
               <th>查無資料</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="(model, index) in list" :key="index">
               <td>
                  <div class="item-price">
                     <span class="mr-1">$</span>
                     <span class="price-number">{{ model.bill.amount }}</span>
                     <v-chip v-show="model.bill.hasDiscount" color="warning"  class="ml-3 mb-2" small>
                     優惠價
                     </v-chip>
                  </div>
               </td>
               <td>
                  <v-chip :color="model.active ? 'success' : ''" small>
                     {{ model.statusText }}
                  </v-chip>
               </td>
               <td>
                  {{ periodText(model) }}
               </td>
            </tr>
         </tbody>
      </template>
   </v-simple-table>
</template>

<script>
import { getSubscribeStartDateText, getPlanEndDateText } from '@/utils';
export default {
   name: 'SubscribesList',
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
      },
   },
   methods: {
      periodText(model) {
         let start = getSubscribeStartDateText(model);
         let end = getPlanEndDateText(model)

         return `${start} 至 ${end} 止`;
      }
   }
}
</script>

<style>

</style>