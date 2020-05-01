<template>
	<v-container>
		<button @click="beginPay">Pay</button>
		
		
	</v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import PaysService from '@/services/pays.service';

export default {
	name: 'TestView',
	data() {
		return {
			pay: {
				model: null,
				maxWidth: DIALOG_MAX_WIDTH,
				active: false,
			},
			
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth']),
	},
	beforeMount() {
		// let dataString = `{"MerchantIDxx":"2000132","MerchantTradeNo":"20200427192918","PaymentDate":"2020/04/27 19:31:26","PaymentType":"Credit_CreditCard","RtnCode":"1"}`;
		// let data = JSON.parse(dataString);
		// console.log(data.MerchantID === '2000132' && data.TradeNumber);
	},
	methods: {
		beginPay() {
			PaysService.store({ MerchantID: 2000132, TradeAmt: 190 })
         .then(model => {
            console.log('model', model);
         })
         .catch(error => {
           console.log('error', error);
         })
		},
		cancelPay() {
			
		}
	},
	

}
</script>


