<template>
   <v-row>
		<v-col cols="12" style="padding-top: 0">
         <v-radio-group v-model="payed" row class="ml-3" hide-details @change="onFilterChanged">
            <v-radio  label="未付款的" :value="false" />
            <v-radio  label="已付款的" :value="true" />
         </v-radio-group>
         <v-simple-table>
            <template v-slot:default>
               <thead>
                  <tr v-if="filteredList.length > 0">
                     <th style="width:25%">金額</th>
                     <th style="width:25%">狀態</th>
                     <th style="width:50%">{{ payed ? '付款日期' : '付款截止日' }}</th>
                  </tr>
                  <tr v-else>
                     <th>查無資料</th>
                  </tr>
               </thead>
               <tbody>
                  <tr @click="select(item)" v-for="(item, index) in filteredList" :key="index">
                     <td>
                        <a href="#" @click.prevent="() => {}" style="text-decoration: none;">
                           <span class="mr-1">$</span>
                           <span style="font-size: 1.2em;">{{ item.amount }}</span>
                        </a>
                     </td>
                     <td>
                        <v-chip small color="success" v-if="item.payed">已付款</v-chip>
                        <v-chip small v-else>未付款</v-chip>
                     </td>
                     <td>
                        {{ payed ? item.payedDateText : item.deadLineText }}
                     </td>
                  </tr>
               </tbody>
            </template>
         </v-simple-table>
      </v-col>
   </v-row>
     
</template>

<script>
import { SET_LOADING } from '@/store/mutations.type';
export default {
   name: 'BillList',
   props: {
      list: {
         type: Array,
         default: null
      }
   },
   data() {
		return {
			payed: false
		}
   },
   computed: {
      filteredList() {
         if(this.list && this.list.length) {
            return this.list.filter(item => item.payed === this.payed);
         }
         return [];
      }
   },
   methods: {
      onFilterChanged() {
         this.$store.commit(SET_LOADING, true);
         setTimeout(() => {
            this.$store.commit(SET_LOADING, false);
         }, 500);
      },
      select(bill) {
        this.$emit('selected', bill);
      }
   }
}
</script>

<style>

</style>