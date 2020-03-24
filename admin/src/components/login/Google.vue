<template>
   <v-btn v-show="ready" outline color="indigo" @click="signIn">
      <helper-google-logo />
      <span class="ml-3 cn"> 使用 Google 登入 </span> 
   </v-btn>
</template>



<script>
import { INIT_GOOGLE_SIGNIN, GOOGLE_SIGNIN } from '@/store/actions.type';

export default {
   name: 'GoogleLoginButton',
   props: {
		width: {
         type: Number,
         default: 240
      },
      height: {
         type: Number,
         default: 50
      }
   },
   data() {
      return {
         ready: false,
         googleSignedIn: false
      }
   },
   mounted() {
      this.$store
      .dispatch(INIT_GOOGLE_SIGNIN)
      .then(result => {
         this.googleSignedIn = result.signedIn;
         this.ready = true;    
      }).catch(error => {
         console.error(error);
      })
   },
   methods: {
      signIn(){
         this.$store
         .dispatch(GOOGLE_SIGNIN)
         .then(id_token => {
            this.$emit('success', id_token);  
         }).catch(error => {
            this.$emit('failed');
         })
      }
   }
};
</script>