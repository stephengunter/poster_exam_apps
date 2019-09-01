<template>
<div>
   <h1>Dashboard</h1>
   <v-btn @click.prevent="test" >
								<v-icon>mdi-plus</v-icon>
							</v-btn>
</div>   
</template>

<script>
import { LOGIN, REFRESH_TOKEN } from '@/store/actions.type';
export default {
   name: 'Dashboard',
   methods: {
      test(){
         this.$store.dispatch(REFRESH_TOKEN).then(token => {	
            if(token){
               console.log(token);
            }else{
               //REFRESH_TOKEN 失敗
               console.log('failed');
            }
         })
      }
   }
   
}
</script>