<template>
   <v-card>
      <v-card-title class="font-weight-black">
         <span style="font-size:1.3em" >訂單內容</span>
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
         <v-row v-if="model.payed">
            <v-col cols="12">
               <span class="font-weight-thin">付款紀錄</span>
               <pay-list :list="model.pays"
               />
            </v-col>
         </v-row>
         <v-row v-else>
            <v-col cols="6">
               <span class="font-weight-thin">訂單金額</span>
               <p class="item-price mt-1">
                  <span class="mr-1">$</span>
                  <span class="price-number">{{ model.needPayMoney }}</span>
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">付款截止日</span>
               <p>
                  {{ model.deadLineText }}
               </p>
            </v-col>
         </v-row>
         <v-row v-if="canPay">
            <v-col cols="12" >
               <span class="font-weight-thin">付款方式</span>
               <v-radio-group v-model="payWayId">
                  <v-radio  v-for="(item, index) in payway_options" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>
            </v-col>
            <v-col cols="12">
               <v-btn color="success" large @click="beginPay">
                  我要付款
               </v-btn>
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
      payway_options: {
         type: Array,
         default: null
      },
      allow_cancel: {
         type: Boolean,
         default: true
      },
   },
   data() {
		return {
			payWayId: 0
		}
   },
   computed: {
      canPay() {
         if(this.model) {
            if(this.model.payed) return false;
            if(this.model.expired) return false;
            return (this.payway_options && this.payway_options.length > 0);
         }return false;
      }
   },
   beforeMount() {
      if(this.canPay) {
         this.payWayId = this.model.payWayId;
         if(this.payway_options.findIndex(item => item.value === this.payWayId) < 0) {
            this.payWayId = this.payway_options[0].value;
         }
      }
   },
   methods: {
		cancel() {
         this.$emit('cancel')
      },
      beginPay() {
         console.log('beginPay');
      }
	}
}
</script>