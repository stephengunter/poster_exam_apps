<template>
   <div :style="{ 'padding-top': index > 0 ? '1em' : '' }">
      <p v-if="model.title">{{ model.title }}</p>
     
      <core-highlight :queries="model.highlights" :content="model.text" />

      <div v-for="(media, index) in attachments" :key="index">
         <a href="#" @click.prevent="showPhoto(media)">
            <v-img class="mt-2" :src="media.id | photoIdUrl(100)"
            max-width="100"           
            />
         </a>
         <span>{{ media.title }}</span> 
      </div>
   </div>
</template>

<script>
import { SHOW_PHOTO } from '@/store/actions.type';
export default {
   name: 'SourceItem',
   props: {
      index: {
         type: Number,
         default: 0
      },
      model: {
         type: Object,
         default: null
      }
   },
   computed: {
      attachments() {
         if(this.model && this.model.attachments.length) {
            return this.model.attachments.map(media => {
               let parts = media.split(',');
               return { id: parseInt(parts[0]), title: parts[1] }
            });
         }
         return [];
      }      
   },
   methods: {
      showPhoto(photo) {
         Bus.$emit(SHOW_PHOTO, photo);
      }
   }
}
</script>