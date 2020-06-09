<template>
   <v-container grid-list-sm fluid>
      <v-layout v-if="responsive" row wrap>
         <v-flex v-for="(item, index) in list" :key="index" xs4 d-flex>
            <v-card flat tile class="d-flex">
               <attachment-item :item="item"
               @select="onSelect"
               />
            </v-card>
         </v-flex>
      </v-layout>
      <v-layout v-else row wrap>
         <v-flex v-for="(item, index) in list" :key="index" xs3 d-flex>
            <v-card flat tile class="d-flex">
               <attachment-item :item="item"
               @select="onSelect"
               />
            </v-card>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
   name: 'AttachmentList',
   props: {
      list: {
         type: Array,
         default: null
      }
   },
   data () {
      return {
         
      }
   },
   methods: {
      onSelect(item) {
         this.$emit('select', item);
      },
      cancel() {
         this.$emit('cancel');
      }
         
   }
}
</script>

<style>

</style>