<template>
   <core-container>
      <v-card>
      <v-card-title class="font-weight-black">
         <span style="font-size:1.3em">訂單內容</span>
         <v-spacer />
         <a href="#" class="a-btn">
            <v-icon>mdi-window-close</v-icon>
         </a>
      </v-card-title>
      <v-card-text>
         <v-row>
            <v-col cols="8" md="6">
               <span class="font-weight-thin">建檔時間</span>
               <p>
                  2011-12-10
               </p>
            </v-col>
            <v-col cols="4" md="6">
               <span class="font-weight-thin ml-1">訂單狀態</span>
               <p>
                 <v-chip color="success" >已付款</v-chip>
               </p>
            </v-col>
         </v-row>

         
         <v-row>
            <v-col cols="12">
               <span class="font-weight-thin">付款紀錄</span>
               
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_QUESTIONS } from '@/store/actions.type';
import { SET_TERMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, findSubject } from '@/utils';

export default {
   name: 'DashboardView',
   data () {
      return {
         
      }
   },
   computed: {
     
	},
   beforeMount() {
      let months = ['Jan', 'March', 'April', 'June'];
      months.splice(1, 0, 'Feb');
      console.log(months);
   },
   mounted() {
		
	},
   methods: {
      
   }
}
</script>

<style>

</style>