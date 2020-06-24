<template>
   <v-container>
      <core-date-filter :start="start" :end="end" />
   </v-container>
  
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
   data () {
      return {
         start: '2020-05-01',
         end: ''
      }
   },
   computed: {
      ...mapGetters(['contentMaxWidth'])
   },
	beforeMount() {
      
   },
	methods: {
      submit() {
         
      }
	}
}
</script>