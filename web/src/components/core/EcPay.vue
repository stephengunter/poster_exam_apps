<template>
   <div v-if="ready">
      <v-dialog v-model="active" :max-width="maxWidth" persistent>
         <v-card>
            <v-card-title class="font-weight-black">
               <span style="font-size:1em" >{{ title }}</span>
               <v-spacer />
               <a href="#" @click.prevent="onCancel" class="a-btn">
                  <v-icon>mdi-window-close</v-icon>
               </a>
            </v-card-title>
            <v-card-text>
               <v-row>
                  <v-col cols="12">
                     <iframe class="ec-pay-window" :src="url">
                        
                     </iframe>
                  </v-col>
               </v-row>
            </v-card-text>
         </v-card>
      </v-dialog>
      <v-dialog v-model="confirm.active" :max-width="confirm.maxWidth">
			<v-card>
				<v-card-title>確定要中止支付程序嗎？</v-card-title>
				<v-card-actions>
					<v-spacer></v-spacer>
					
					<v-btn color="green darken-1" text @click="cancel">
						確定
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
   </div>
   
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { SITE_URL, DIALOG_MAX_WIDTH } from '@/config';
import { buildQuery, resolveQueryString, tryParseInt, tryParseJsonObj } from '@/utils';
import { ATM, CREDIT } from '@/consts';
import { SET_AUTH_CHANGED } from '@/store/mutations.type';

export default {
   name: 'EcPay',
   props: {
      model: {
			type: Object,
			default: null
      },
      check_device: {
			type: Boolean,
			default: false
      },
      is_active: {
			type: Boolean,
			default: false
      },
   },
   data() {
      return {
         ready: false,
         title: '線上付款',
         url: '',
         active: false,
         maxWidth: DIALOG_MAX_WIDTH,
         isMobileAgent: false,

         result: null,

         confirm: {
				maxWidth: DIALOG_MAX_WIDTH,
				active: false,
			}
      }
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
      hasSuccessResult() {
         if(this.result) {
            let paymentType = this.model.paymentType;
            let rtnCode = tryParseInt(this.result.RtnCode);
            if(paymentType === ATM) {
               return rtnCode === 2;  //ATM 取號成功
            }else if(paymentType === CREDIT) {
               return rtnCode === 1;
            }
         }return false;
      }
   },
   watch: {
      is_active: 'onActiveChanged'
   },
   beforeMount() {
      let tokenModel = this.model.tokenModel
      let tradeModel = {
         MerchantID: tokenModel.merchantID,
         SPToken: tokenModel.spToken,
         PaymentType: this.model.paymentType
      };

      this.url = buildQuery(this.model.checkOutURL, tradeModel);

      if(this.check_device) this.setDevice();
      else this.onReady();
      
   },
   mounted(){
		window.addEventListener('message', this.onMessage);
	},
	beforeDestroy(){
      window.removeEventListener('message', this.onMessage)
	},
   methods: {
      setDevice() {
         let isMobileAgent = false;
         var userAgent = navigator.userAgent;
         
         let checkMobile = new RegExp("android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino");
         let checkMobile2 = new RegExp("mobile|mobi|nokia|samsung|sonyericsson|mot|blackberry|lg|htc|j2me|ucweb|opera mini|mobi|android|iphone");

         if(checkMobile.test(userAgent) || checkMobile2.test(userAgent.toLowerCase())) {
            isMobileAgent = true;
         }

         this.isMobileAgent = isMobileAgent;

         this.onReady();
         
      },
      onReady() {
         if(this.isMobileAgent) {
            let params = {
               scrollbars: 'no',
               resizable: 'no',
               status: 'no',
               location: 'no',
               menubar: 'no',
               width: 0,
               height: 0,
               left: -1000,
               top: -1000,
            };
            window.open(this.url, this.title, resolveQueryString(params));
         }else {
            this.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			   this.active = true;
         }
         this.ready = true;
      },
      onMessage(e) {
         if(e.origin != SITE_URL) {
            let data = tryParseJsonObj(e.data);
            if(data && data.hasOwnProperty('RtnCode')) this.setResult(data);
         }
      },
      setResult(data) {
         this.result = data;
         let paymentType = this.model.paymentType;
         let rtnCode = tryParseInt(data.RtnCode);
         if(paymentType === CREDIT && rtnCode === 1) {
            this.$store.commit(SET_AUTH_CHANGED, true);
         }
      },
      onCancel() {
         if(this.hasSuccessResult) this.cancel();
         else this.confirm.active = true;
      },
		cancel() {
			this.$emit('cancel', this.hasSuccessResult);
      },
      onActiveChanged(val) {
         this.active = val;
      }
	},
}
</script>

<style scoped>
.ec-pay-window {
   background: rgba(0, 0, 0, 0.00392157);
   border: 0px none transparent;
   overflow-x: hidden;
   overflow-y: auto;
   visibility: visible;
   padding: 0px; -webkit-tap-highlight-color: transparent; 
   
   width: 100%;
   min-height: 480px;
}

</style>