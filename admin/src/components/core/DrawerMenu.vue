<template>
   <v-list-group v-if="item.subs && item.subs.length" :value="expend">
      <template  v-slot:activator>
         <v-list-tile avatar class="v-list-item" :active-class="color" :to="item.path">
            <v-list-tile-action>
               <v-icon>{{ item.meta.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ item.meta.title }}</v-list-tile-title>
         </v-list-tile>
      </template>
      <v-list-tile v-for="(subItem, subIndex) in item.subs" :key="subIndex"
         avatar class="v-list-item"  :active-class="color" :to="subItem.path"
      >
         <v-list-tile-title avatar class="v-list-item">{{ subItem.meta.title }}</v-list-tile-title>
         <v-list-tile-action>
            <v-icon>{{ subItem.meta.icon }}</v-icon>
         </v-list-tile-action>
      </v-list-tile>
   </v-list-group>

   
   <v-list-tile v-else avatar class="v-list-item" :active-class="color" :to="item.path">
      <v-list-tile-action>
         <v-icon>{{ item.meta.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>{{ item.meta.title }}</v-list-tile-title>
   </v-list-tile>
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
   data(){
      return {
         
      }
   },
   computed: {
      expend(){
         if(!this.item) return false;
         let subActive = this.item.subs.find(subItem => subItem.active);
         if(subActive) return true;
         return false;
      }
   }
}
</script>

