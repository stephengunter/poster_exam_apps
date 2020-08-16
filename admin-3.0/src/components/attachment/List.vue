<template>
   <v-row v-if="responsive">
      <v-col v-for="(item, index) in list" :key="index" cols="4" class="d-flex child-flex">
         <a href="#" @click.prevent="select(item)">
            <v-card flat tile class="d-flex">
               <attachment-item :item="item" />
            </v-card>
         </a>
      </v-col>
   </v-row>
   <v-row v-else>
      <v-col v-for="(item, index) in list" :key="index" cols="3" class="d-flex child-flex">
         <a href="#" @click.prevent="select(item)">
            <v-card flat tile class="d-flex">
               <attachment-item :item="item" />
            </v-card>
         </a>
      </v-col>
   </v-row>
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
   computed: {
      ...mapGetters(['responsive'])
   },
   methods: {
      select(item) {
         console.log('select', item);
         this.$emit('selected', item);
      }        
   }
}
</script>