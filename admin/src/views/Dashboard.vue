<template>
   <div>

      
<a href="#" @click.prevent="test">Test</a>

   </div>
  
</template>

<script>
import BaseService from '@/common/baseService';
import DataService from '@/services/data.service';
import { API_URL } from '@/config';

export default {
   data () {
      return {
         
      }
   },
   beforeMount(){
		this.fetchData();
   },
   methods: {
      test() {
         let key = 'dcd5f797-beea-40be-b1fb-e0f2933bb607';
         DataService.storeSubjectQuestions({ key })
         .then(model => {
            console.log(model);
         })
         .catch(error => console.error(error))
      },
      fetchData() {
         let url = `${API_URL}/atest`;
         let params = { subject: 1 };
         BaseService.fetch(url, params)
         .then(model => {
            console.log('model', model);
         })
         .catch(error => console.error(error))
      }
   }
}
</script>