<template>
   <core-container>
      
   </core-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { FETCH_QUESTIONS } from '@/store/actions.type';
import { SET_TERMS } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { onError, removeHtmlTags } from '@/utils';

export default {
   name: 'DashboardView',
   data () {
      return {
         media: {
            previewPath: '20211027/d4a744e3-5df5-4dd5-9cb7-38ddc0a4e6d6.jpg',

         }
      }
   },
   computed: {
     
	},
   beforeMount() {
      const string = `<div>This</div><h1>Is</h1> <p>A</p> <a href="#">Test</a>`;

      //const doc = new DOMParser().parseFromString(string, "text/html");
      //console.log(doc.body);

      console.log(removeHtmlTags(string));
   },
   mounted() {
		
	},
   methods: {
      
   }
}
</script>

<style>

</style>