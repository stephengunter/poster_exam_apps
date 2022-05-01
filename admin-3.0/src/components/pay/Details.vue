<template>
   <v-card>
      <v-card-title class="font-weight-black">
         <span style="font-size:1.3em" v-text="title"></span>
         <span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
         <v-spacer />
         <a href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text >
         <v-row>
            <v-col cols="6">
               <span class="font-weight-thin">建檔時間</span>
               <p>
                  {{ model.createdAtText }}
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">BillId</span>
               <p>
                  {{ model.billId }}
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">支付方式</span>
               <p>
                  {{ model.payWay }}
               </p>
            </v-col>
            <v-col cols="6" >
               <span class="font-weight-thin">金額</span>
               <p v-if="model.money" >
                  <span class="money mr-1">$</span>
                  <span class="money">{{ model.money }}</span>
                  <span class="ml-2">{{ model.payedDateText}}</span>
               </p>
               <p v-else>
                  {{ model.money }}
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">Code</span>
               <p>
                 {{ model.code }}
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">虛擬帳號</span>
               <p>
                  <span v-text="model.bankCode"></span>
                  <span class="ml-3" v-text="model.bankAccount"></span>
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">TradeNo</span>
                <p v-text="model.tradeNo">
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">TradeData</span>
               <p v-text="model.tradeData">
               </p>
            </v-col>
         </v-row>
         
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'PayDetails',
   props: {
      model: {
			type: Object,
			default: null
      }
   },
   data() {
		return {
			
		}
   },
   computed: {
      title() {
			if(this.model) {
				return this.model.hasMoney ? '付款紀錄' : '付款資訊';
			} return '';
      }
   },
   methods: {
		cancel() {
         this.$emit('cancel')
      }
	}
}
</script>


<style scoped>
.money{
   color: #ee4d2d;
   font-weight: 400;	
	font-size: 155%;
	max-width: 130px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
