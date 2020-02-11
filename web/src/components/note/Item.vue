<template>
<v-row>
   <v-col cols="12" v-if="model.text">
      <core-highlight  :queries="model.highlights" :content="model.text" />
   </v-col>
   <v-col :cols="responsive ? 6 : 4" v-for="(photo, index) in model.attachments" :key="index">
      <a href="#" @click.prevent="showPhoto(photo)">
         <v-img :src="photo.previewPath | photoNameUrl(100)" max-width="100" aspect-ratio="1"
         />
      </a>
      <span v-if="photo.title" class="ml-1">{{ photo.title }}</span>
   </v-col>
</v-row>	
				
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
   name: 'NoteItem',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   computed: {
		...mapGetters(['responsive'])
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