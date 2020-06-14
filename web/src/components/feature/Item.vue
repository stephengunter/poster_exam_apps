<template>
   <v-row v-if="model">
      <v-col cols="12">
         <h3>
           {{ model.title }}
         </h3>
         <div v-if="model.summary" class="mt-3" v-html="model.summary">
            
         </div>
      </v-col>
      <v-col cols="12">
         <article v-html="model.content">
            
         </article>
      </v-col>
   </v-row>
</template>

<script>
import { convertHtmlContent } from '@/utils';
export default {
   name: 'FeatureItem',
   props: {
      item: {
         type: Object,
         default: null
      },
      max_width: {
         type: Number,
         default: 0
      }
   },
   data() {
		return {
			model: null
		}
	},
   watch: {
      item:{
         handler(){
            this.init();
         },
         deep: true
      },
      'max_width' : 'init'
   },
   beforeMount() {
      this.init();
   },
   methods: {
		init() {
         if(!this.item) return;

			this.model = {
            ...this.item,
            summary: convertHtmlContent(this.item.summary, this.max_width),
            content: convertHtmlContent(this.item.content, this.max_width)
         };
		}
	}
}
</script>

<style>

</style>