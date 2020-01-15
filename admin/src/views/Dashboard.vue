<template>
<div>
   <input style="width:300px" v-model="originalUrl">
   <button @click="test">Test</button>
</div>
</template>

<script>
const validUrl = require('valid-url');
export default {
   name: 'Dashboard',
   data() {
      return {
         url: '',
         originalUrl: '',
         shortBaseUrl: 'http://postexam.com.tw'
      }
   },
   methods: {
      test(){
         if (validUrl.isUri(this.shortBaseUrl)) {
            console.log('ok');
         } else {
            alert('damn');
         }
      }
   }
   
}
</script>
