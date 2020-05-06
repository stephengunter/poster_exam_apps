<template>
   <v-simple-table v-if="mode === 'summary'">
      <template v-slot:default>
         <thead>
            <tr>
               <th style="width:25%">金額</th>
               <th>有效期限</th>
            </tr>
         </thead>
         <tbody>
            <tr>
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
                  {{ periodText }}
               </td>
            </tr>
         </tbody>
      </template>
   </v-simple-table>
   <v-card v-else class="px-4" style="min-height: 225px" :color="color" :flat="flat">
      <v-card-title class="font-weight-black">
         <v-row>
            <v-col cols="4" class="text-left">
               <div class="item-price">
                  <span class="mr-1">$</span>
                  <span class="price-number">{{ model.price }}</span>
                  <v-chip v-show="model.hasDiscount" color="warning"  class="ml-3 mb-2" small>
                  優惠價
                  </v-chip>
               </div>
            </v-col>
            <v-col cols="8" class="text-left subtitle-1">
               <span>有效期限：{{ endDateText }}</span>
            </v-col>
         </v-row>
      </v-card-title>
      <v-card-text class="subtitle-1" style="text-align: left">
         <v-row>
            <v-col cols="12">
               <p v-html="model.description">
           
               </p>
            </v-col>
         </v-row>
         <v-row v-if="currentUser && currentUser.email === 'traders.com.tw@gmail.com'">
            <v-col cols="12">
               <v-btn color="primary" large @click.prevent="select">
                  我要訂閱
               </v-btn>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isDev, getPlanStartDateText, getPlanEndDateText } from '@/utils';
export default {
   name: 'SubscribePlan',
   props: {
      model: {
         type: Object,
         default: null
      },
      mode: {
         type: String,
         default: 'details'
      },
      color: {
         type: String,
         default: ''
      },
      flat: {
         type: Boolean,
         default: false
      },
   },
   mounted() {
      console.log('currentUser', this.currentUser);
   },
   computed: {
      ...mapGetters(['contentMaxWidth', 'currentUser']),
      periodText() {
         if(this.model) {
            let start = getPlanStartDateText(this.model);
            let end = getPlanEndDateText(this.model)

            return `${start} 至 ${end} 止`;
         }
         return '';
      },
      endDateText() {
         if(this.model) {
            let end = getPlanEndDateText(this.model);

            return `至 ${end} 止`;
         }
         return '';
      }
   },
   methods: {
		select() {
         this.$emit('select', this.model.id)
      }
	}
}
</script>
