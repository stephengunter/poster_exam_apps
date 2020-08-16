<template>
   <v-container :id="id" fluid tag="section">
      <slot />
   </v-container>
</template>

<script>
export default {
   name: 'CoreContainer',
   props: {
      id: {
        type: String,
        default: 'core-container',
      }
   },
}
</script>

<style>

</style>