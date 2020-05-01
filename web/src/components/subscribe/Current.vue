<template>
   <v-card>
      <v-card-text>
         <v-row>
            <v-col cols="6">
               <span class="font-weight-thin ml-1">狀態</span>
               <p>
                  <v-chip class="mt-1" :color="model.active ? 'success' : ''" >
                     {{ model.statusText }}
                  </v-chip>
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">有效期限</span>
               <p>
                  <span class="title">
                    {{ endDateText }}                    
                  </span>
               </p>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
</template>

<script>
import { getPlanStartDateText, getPlanEndDateText } from '@/utils';
export default {
   name: 'SubscribeCurrent',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   computed: {
      endDateText() {
         if(this.model) {
            return getPlanEndDateText(this.model);
         }
         return '';
      }
   },
   methods: {
	}
}
</script>