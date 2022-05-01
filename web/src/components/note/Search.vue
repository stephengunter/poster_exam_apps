<template>
   <form @submit.prevent="search">
      <v-text-field label="" single-line hide-details
      v-model="params.keyword"
      >
         <template v-slot:prepend>
            <a href="#" @click.prevent="search" class="a-btn">
               <v-icon>mdi-magnify</v-icon>
            </a>
         </template>
         <template v-slot:append>
            <a href="#" @click.prevent="clearSearch" class="a-btn">
               <v-icon>mdi-close</v-icon>
            </a>
         </template>
      </v-text-field>
   </form>
</template>

<script>
export default {
   props: {
      params: {
         type: Object,
         default: null
      }
   },
   methods: {
      search() {
         this.$emit('search');
      },
      clearSearch() {
         this.$emit('clear-search');
		}
   }
}
</script>

<style>

</style>