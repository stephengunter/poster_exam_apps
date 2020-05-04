<template>
<div>
   <v-card>
      <v-card-title class="font-weight-black">
         <span style="font-size:1.3em" >訂單內容</span>
         <v-spacer />
         <a v-if="allow_cancel" href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-row v-if="model.id">
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
         <v-row v-if="model.id" v-show="!paying">
            <v-col v-if="model.payInfo" cols="6">
               <span class="font-weight-thin">ATM繳費帳號</span>
               <p>
                  007
                  1057601295632832
               </p>
            </v-col>
            <v-col v-else cols="6">
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
               <v-radio-group v-model="model.payWayId">
                  <v-radio  v-for="(item, index) in paywayOptions" :key="index"
                  :label="item.text" :value="item.value" 
                  />
               </v-radio-group>
            </v-col>
            <v-col cols="12">
               <v-btn v-if="model.id" color="success" large @click="beginPay"
               :loading="paying" :disabled="paying"
               >
                  我要付款
               </v-btn>
               <v-btn v-else color="success" large @click="onSubmit">
                  確認送出
               </v-btn>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
   <core-ec-pay v-if="pay.model" :model="pay.model" :is_active="pay.active" 
   @cancel="cancelPay"
   />
</div>   
</template>

<script>
import { isBadRequest } from '@/utils';
import { STORE_SUBSCRIBE, BEGIN_PAY } from '@/store/actions.type';
import { DIALOG_MAX_WIDTH } from '@/config';
export default {
   name: 'BillEdit',
   props: {
      model: {
			type: Object,
			default: null
      },
      payways: {
         type: Array,
         default: null
      },
      allow_cancel: {
         type: Boolean,
         default: true
      },
      action: {
         type: String,
         default: ''
      },
   },
   data() {
		return {
         paying: false,
         pay: {
				maxWidth: DIALOG_MAX_WIDTH,
				model: null,
				active: false,
			},
		}
   },
   computed: {
      paywayOptions() {
         if(this.payways) {
            return this.payways.map(item => ({
               value: item.id, text: item.title
            }));
         }return [];   
      },
      selectedPayWay() {
         if(this.model && this.payways) {
            return this.payways.find(item => item.id === this.model.payWayId);
         }return null;
      },
      canPay() {
         if(this.model) {
            if(this.model.payed) return false;
            if(this.model.expired) return false;
            return (this.paywayOptions && this.paywayOptions.length > 0);
         }return false;
      }
   },
   beforeMount() {
      if(this.canPay) {
         let payWayId = this.model.payWayId;
         if(this.paywayOptions.findIndex(item => item.value === payWayId) < 0) {
            this.model.payWayId = this.paywayOptions[0].value;
         }
      }
   },
   mounted() {
      if(this.action) {
         if(this.action === BEGIN_PAY) this.beginPay();
      }

      console.log('this.model', this.model);
   },
   methods: {
		cancel() {
         this.$emit('cancel');
      },
      onSubmit() {
			this.$store.dispatch(STORE_SUBSCRIBE, this.model)
			.then(bill => {
            this.$emit('created', bill);
         })
			.catch(error => {
            error.title = '建立訂單失敗，請稍候再試.';
            Bus.$emit('errors', error);
            this.$emit('create-bill-failed');
         })
      },
      beginPay() {
         this.paying = true;

			this.$store.dispatch(BEGIN_PAY, this.model)
			.then(model => {
            console.log('model', model);   
            this.pay.active = true;
				this.pay.model = model;
         })
			.catch(error => {
				let badRequestData = null;
				if(isBadRequest(error)) badRequestData = error.data;
				if(badRequestData) {
					if(badRequestData['payed']) {
						//此訂單已經支付過了
						error.title = badRequestData['payed'][0];
					}else if(badRequestData['expired']) {
						//訂單已過繳款期限
						error.title = badRequestData['expired'][0];
					}else {
						error.title = badRequestData[Object.keys(badRequestData)[0]][0];
					}
				}else {
					error.title = '開啟支付程序失敗，請稍候再試.'
            }
            
            Bus.$emit('errors', error);
				
				this.$emit('begin-pay-failed');
         })
      },
      cancelPay() {
			this.pay.active = false;
			setTimeout(() => {
				this.pay.model = null;
         }, 500);
         this.$emit('pay-canceled');
		},
	}
}
</script>