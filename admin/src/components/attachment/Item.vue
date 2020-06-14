<template>
   <v-img v-if="!loadError" aspect-ratio="1" class="grey lighten-2 img-center"
   style="display: block; margin: auto;"
   @error="onImageError" :max-width="item.width"
   :max-height="item.height"
   :src="item.previewPath | photoNameUrl()"
   :lazy-src="item.previewPath | photoNameUrl(50)"
   @click.prevent="select"
   >
      <template v-slot:placeholder>
         <v-layout fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
         </v-layout>
      </template>
   </v-img>
</template>

<script>

export default {
   name: 'AttachmentItem',
   props: {
      item: {
         type: Object,
         default: null
      }
   },
   data () {
      return {
         loadError: false
      }
   },
   methods: {
      select() {
         this.$emit('select', this.item);
      },
      onImageError() {
         this.loadError = true;
      }
         
   }
}
</script>

<style>

</style>