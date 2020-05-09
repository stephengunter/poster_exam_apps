<template>
<div style="margin-top:1em">
   <vue-recaptcha ref="recaptcha_v2" :loadRecaptchaScript="true"
   :sitekey="sitekey"
   @verify="onVerify" @expired="onExpired"
   >
   </vue-recaptcha>
</div>   
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import { GOOGLE_RECAPTCHA_PARAMS } from '@/config';
import BaseService from '@/common/baseService';

export default {
   name: 'RecaptchaV2',
   components: { 
		'vue-recaptcha': VueRecaptcha 
   },
   data(){
		return {
         sitekey: GOOGLE_RECAPTCHA_PARAMS.sitekey,
         token: ''
		}
   },
   methods: {
		onVerify(response) {
         this.token = response;
         this.$emit('token-changed', this.token);
		},
		onExpired() {
         this.token = '';
         this.$emit('token-changed', this.token);
      },
		reset() {
         this.$refs.recaptcha_v2.reset();
         this.token = '';
         this.$emit('token-changed', this.token);
      }
   }
}
</script>

<style>

</style>