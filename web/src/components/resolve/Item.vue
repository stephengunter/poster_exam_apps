<template>
   <v-row v-if="hasSources">
      <v-col cols="12" v-for="(item, index) in model.sources"  :key="index">
         <source-item  :model="item" :index="index" />
      </v-col>
     
   </v-row>
   <v-row v-else>
      <v-col v-if="model.text" cols="12" :md="hasAttachments ? 8 : 12">
         <core-highlight  :queries="model.highlights" :content="model.text" />
         
      </v-col>
      <v-col cols="12" :md="hasText ? 4 : 12">
         <div v-for="(item, index) in model.attachments" :key="index">
            <a href="#" @click.prevent="showPhoto(item)">
               <v-img :src="item.previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1"
               />
            </a>
            <span v-if="item.title" class="ml-1">{{ item.title }}</span>
         </div>
      </v-col>
   </v-row>
</template>

<script>
export default {
   name: 'ResolveItem',
   computed:{
      hasSources() {
         if(!this.model) return false;
         return this.model.sources.length > 0;
      },
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
      }      
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