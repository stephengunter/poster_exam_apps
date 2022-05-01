<template>
   <v-card>
      <v-card-title class="font-weight-black">
         <span style="font-size:1.3em">訂單內容</span>
         <span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
         <v-spacer />
         <a href="#" @click.prevent="cancel" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="6">
               <span class="font-weight-thin">建檔時間</span>
               <p>
                  {{ model.createdAtText }}
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">UserName</span>
               <p>
                  {{ model.user.userName }}
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin">金額</span>
               <p class="item-amount">
                  <span class="mr-1">$</span>
                  <span class="amount-number">{{ model.amount }}</span>
               </p>
            </v-col>
            <v-col cols="6">
               <span class="font-weight-thin ml-1">訂單狀態</span>
               <p>
                  <v-chip v-if="model.payed" color="green" text-color="white">{{ model.statusText }}</v-chip>
                  <v-chip v-else >{{ model.statusText }}</v-chip>
                  <span v-if="model.payed" class="ml-1">{{ model.payedDateText}}</span>
               </p>
            </v-col>
         </v-row>
         <v-row>
            <v-col cols="12">
               <span class="font-weight-thin">付款紀錄</span>
               <pay-list :list="payedList"
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
      }
   },
   data() {
		return {
			
		}
   },
   computed: {
      payedList() {
         if(this.model) {
            return this.model.pays;
         }return [];
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
.item-amount {
	color: #ee4d2d;
   font-weight: 400;	
}
.amount-number{
	font-size: 155%;
	max-width: 130px;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
