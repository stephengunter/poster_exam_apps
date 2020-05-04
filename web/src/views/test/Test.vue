<template>
	<v-container>
		<button @click=beginPay>Pay</button>
		
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
			messages: 8,
			pay: {
				model: null,
				maxWidth: DIALOG_MAX_WIDTH,
				active: false,
			},

			atmFeedBack: {
				ExpireDate: '2020/05/09',
				MerchantID: '2000132',
				MerchantTradeNo: '4uais6uhpq7y',
				PaymentType: 'ATM_FIRST',
				RtnCode: '2',

				RtnMsg: 'Get VirtualAccount Succeeded',
				TradeAmt: '190',
				TradeDate: '2020/05/02 11:29:02',
				TradeNo: '2005021128494040',
				BankCode: '007',
				vAccount: '1057601301763422',

				StoreID: '',
				CustomField1: '',
				CustomField2: '',
				CustomField3: '',
				CustomField4: '',
				CheckMacValue: '15B97743A339C9A5AB452AEC1933997556428CCF263A257376CF7A0F194E25E2'

			},

			htFeedback: 
			{
				BankCode:'005',
				ExpireDate:'2020/05/09',
				MerchantID:'2000132',
				MerchantTradeNo:'4uaism5o6s30',
				PaymentType:'ATM_LAND',
				RtnCode:'2',

				RtnMsg: 'Get VirtualAccount Succeeded',
				TradeAmt:'190',
				TradeDate:'2020/05/02 12:24:29',
				TradeNo:'2005021224224073',
				vAccount:'5219913078453166',
				
				
				StoreID: '',
				CustomField1:'',
				CustomField2: '',
				CustomField3: '',
				CustomField4: '',
				
			},

			htResult: 
			{
				SimulatePaid: '1',
				RtnMsg: '????',
				MerchantID: '2000132',
				StoreID: '',
				CustomField3: '',
				CustomField2: '',
				CustomField4: '',
				TradeDate: '2020/05/02 20:05:37',
				TradeAmt: '190',
				MerchantTradeNo: '20200502E4KS6FKW8NRT',
				PaymentTypeChargeFee: '0',
				PaymentType: 'ATM_FIRST',
				TradeNo: '2005022005374216',
				RtnCode: '1',
				CustomField1: '',
				PaymentDate: '2020/05/02 20:50:18'
			}
			
		}
	},
	computed: {
		...mapGetters(['contentMaxWidth']),
	},
	beforeMount() {
		// let dataString = `{MerchantIDxx:2000132,MerchantTradeNo:20200427192918,PaymentDate:2020/04/27 19:31:26,PaymentType:Credit_CreditCard,RtnCode:1}`;
		// let data = JSON.parse(dataString);
		// console.log(data.MerchantID === '2000132' && data.TradeNumber);
	},
	methods: {
		beginPay() {
			PaysService.store(this.htResult)
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


