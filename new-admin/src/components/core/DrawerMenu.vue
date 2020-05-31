<template>
   <v-list-group v-if="item.subs && item.subs.length" no-action
   :prepend-icon="item.meta.icon" :value="isActive(item)" :disabled="isActive(item)"
   >
      <template v-slot:activator>
         <v-list-item-content @click.prevent="linkTo(item)">
            <v-list-item-title v-text="item.meta.title"></v-list-item-title>
         </v-list-item-content>
      </template>
      <v-list-item v-for="(subItem, subIndex) in item.subs" :key="subIndex" :to="subItem.path">
            <v-list-item-title v-text="subItem.meta.title"></v-list-item-title>
            <v-list-item-icon>
               <v-icon v-text="subItem.meta.icon"></v-icon>
            </v-list-item-icon>
      </v-list-item>
   </v-list-group>
   <v-list-item v-else :to="item.path">
      <v-list-item-icon>
         <v-icon>{{ item.meta.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
   </v-list-item>
</template>


<script>
export default {
   name: 'DrawerMenu',
   props: {
      item: {
         type: Object,
         default: null
      },
      color: {
         type: String,
         default: 'info'
      },
   },
   methods: {
      isActive(item) {
         if(item.active) return true;

         let subActive = item.subs.find(subItem => subItem.active);
         if(subActive) return true;
         return false;
      },
      linkTo(item) {
         this.$router.push({ path: item.path});
      },
   }
}
</script>

