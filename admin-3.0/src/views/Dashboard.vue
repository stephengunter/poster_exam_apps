<template>
   <core-container>
      <v-row>
         <v-col cols="12">
            
			</v-col>
      </v-row>
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

   },
   mounted() {
		
	},
   methods: {
      
   }
}
</script>

<style>

</style>