<template>
   <v-app-bar app color="success" dark>
      <v-app-bar-nav-icon @click.prevent="toggleDrawer" />
      <v-toolbar-title class="site-title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu left bottom >
         <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
               <v-avatar color="orange">
                  <span class="white--text headline">62</span>
               </v-avatar>
            </v-btn>
         </template>
         <v-list>
            <v-list-item>
               <v-list-item-title>登出</v-list-item-title>
            </v-list-item>
         </v-list>
      </v-menu>
   </v-app-bar>
</template>

<script>
import { TOGGLE_DRAWER } from '@/store/mutations.type';
import { SITE_TITLE } from '@/config';
export default {
   name: 'TheHeader',
   data() {
      return {
         title: SITE_TITLE
      }
   },
   beforeMount() {
      
   },
   methods:{
      toggleDrawer(){
         this.$store.commit(TOGGLE_DRAWER);
      },
      logout(){
         this.$store.dispatch(LOGOUT)
         .then(() => this.$router.push({ path: '/login' }))
      }
   }
};
</script>

<style scoped>
.site-title{
   font-size : 2.2rem!important;
}
</style>