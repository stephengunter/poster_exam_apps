<template>
   <v-row>
      <v-col v-if="model.text" cols="12" :md="hasAttachments ? 8 : 12">
         <core-highlight  :queries="model.highlights" :content="model.text" />
         
      </v-col>
      <v-col cols="12" :md="hasText ? 4 : 12">
         <div v-for="(item, index) in model.attachments" :key="index">
            <a href="#" @click.prevent="showPhoto(item)">
               <v-img :src="item.previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1"
               @click="showPhoto(item)"
               />
            </a>
            {{ item.title }}
         </div>
      </v-col>
   </v-row>
</template>

<script>
import CoreHighlight from '@/components/core/Highlight';
export default {
   name: 'ResolveItem',
   components: {
		'core-highlight' : CoreHighlight
   },
   computed:{
      hasText() {
         if(!this.model) return false;
         if(this.model.text) return true;
         return false;
      },
      hasAttachments() {
         if(!this.model) return false;
         if(this.model.attachments) return this.model.attachments.length > 0;
         return false;
      }
   },
   props: {
		model: {
         type: Object,
         default: null
      },
      
   },
   methods: {
      showPhoto(item) {
         this.$emit('show-photo', item);
      }
   }
}
</script>

<style>

</style>