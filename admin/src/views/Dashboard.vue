<template>
<div>
   <core-upload-button  >
         
   
    附圖<v-icon right dark>mdi-image</v-icon>
    </core-upload-button>
</div>
</template>

<script>
import BaseService from '@/common/baseService';
import { SHORTEN_URL_API } from '@/config';
export default {
   name: 'Dashboard',
   methods: {
      toggle(){

      }
   },
   data() {
      return {
         photo: null,
         thumb: null
      }
   },
   computed: {

   },
   beforeMount() {
      let params = {
         key: SHORTEN_URL_API.key,
         short: 'https://pweb.cwb.gov.tw/PopularScience/index.php/weather/96-%E7%BF%BB%EF%A4%98%E5%B1%B1%E9%A0%AD%E7%9A%84%E7%81%AB%E7%87%92%E9%A2%A8',
      };
      BaseService.fetch(SHORTEN_URL_API.url, params)
      .then(data => console.log(data))
      .catch(e => console.error(e))
   },
   methods: {
      
   }
   
}
</script>
