<template>
   <v-card v-if="model">
      <core-close-icon-button @close="cancel" />
      <v-card-text>
         <span class="center-helper"></span>
         <v-img class="img-center" :src="model.id | photoIdUrl"
            :max-width="model.width"
         />
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'ShowPhoto',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   methods: {
      cancel() {
         this.$emit('cancel');
      }
   }
}
</script>

<style>

</style>