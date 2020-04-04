<template>
   <form @submit.prevent="submit">
      <v-text-field label="Search" single-line hide-details
      v-model="keyword"
      >
         <template v-slot:prepend>
            <v-icon>mdi-magnify</v-icon>
         </template>
         <template v-slot:append>
            <a href="#" @click.prevent="clear">
               <v-icon>mdi-close</v-icon>
            </a>
         </template>
      </v-text-field>
   </form>
</template>

<script>
export default {
   name: 'Search',
   data () {
      return {
         keyword: ''
      }
   },
   methods: {
      submit() {
         this.$emit('submit', this.keyword);
      },
      clear() {
         this.keyword = '';
         this.$emit('clear');
      }
   }
}
</script>