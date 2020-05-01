<template>
   <v-card>
      <v-card-title class="font-weight-black">
         <span style="font-size:1.3em">訂單內容</span>
         <v-spacer />
         <a v-if="allow_cancel" href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="8" md="6">
               <span class="font-weight-thin">建檔時間</span>
               <p>
                  {{ model.createdAtText }}
               </p>
            </v-col>
            <v-col cols="4" md="6">
               <span class="font-weight-thin ml-1">訂單狀態</span>
               <p>
                 <v-chip color="success" v-if="model.payed">已付款</v-chip>
                 <v-chip v-else>未付款</v-chip>
               </p>
            </v-col>
         </v-row>

         <v-row>
            <v-col cols="12" style="padding-top: 0">
               <span class="font-weight-thin">訂閱方案</span>
               <subscribe-plan :model="model.plan" mode="summary"
               />
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12">
               <span class="font-weight-thin">付款紀錄</span>
               <pay-list :list="model.pays"
               />
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'BillDetails',
   props: {
      model: {
			type: Object,
			default: null
      },
      allow_cancel: {
         type: Boolean,
         default: true
      },
   },
   data() {
		return {
			
		}
   },
   computed: {
      
   },
   methods: {
		cancel() {
         this.$emit('cancel')
      }
	}
}
</script>