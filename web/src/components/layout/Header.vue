<template>
   <v-app-bar app color="success" dark>
      <v-app-bar-nav-icon @click.prevent="toggleDrawer" />
      <v-toolbar-title class="site-title">{{ title }}</v-toolbar-title>
      
      
      <v-spacer></v-spacer>
      <v-menu v-if="appActions.length" offset-y>
         <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
               <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
         </template>
         <v-card class="mx-auto" max-width="300" tile >
            <v-list v-for="(block, index) in appActions" :key="index">
               <v-list-item v-for="(item, index) in block" :key="index" @click.prevent="onActionSelected(item.name)">
                  <v-list-item-icon v-if="item.icon">
                     <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                     <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
               </v-list-item>
               <v-divider v-if="index < appActions.length - 1"></v-divider>
            </v-list>
         </v-card>
      </v-menu>
      <v-menu v-if="currentUser" offset-y>
         <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
               <v-avatar v-if="pictureError" size="36" color="indigo">
                  <span class="cn">{{ currentUser.name }}</span>
               </v-avatar>
               <v-avatar v-else size="36">
                  <img :src="currentUser.picture" @error="pictureError = true">
               </v-avatar>
            </v-btn>
         </template>
         <v-card class="mx-auto" max-width="300" tile >
            <v-list>
               <v-list-item v-for="(item, index) in userMenus" :key="index" @click.prevent="onMenuSelected(item.name)">
                  <v-list-item-icon v-if="item.meta.icon">
                     <v-icon v-text="item.meta.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                     <v-list-item-title>{{ item.meta.title }}</v-list-item-title>
                  </v-list-item-content>
               </v-list-item>
               <v-list-item @click.prevent="logout">
                  <v-list-item-icon>
                        <v-icon>mdi-logout-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                     <v-list-item-title>登出</v-list-item-title>
                  </v-list-item-content>
               </v-list-item>
            </v-list>
         </v-card>
      </v-menu>
      
      
   </v-app-bar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LOGOUT, ACTION_SELECTED } from '@/store/actions.type';
import { TOGGLE_DRAWER } from '@/store/mutations.type';
import { SITE_TITLE } from '@/config';
export default {
   name: 'TheHeader',
   data() {
      return {
         title: SITE_TITLE,
         pictureError: false
      }
   },
   computed:{
		...mapGetters(['currentUser', 'appActions', 'userMenus'])
   },
   methods:{
      toggleDrawer(){
         this.$store.commit(TOGGLE_DRAWER);
      },
      logout(){
         this.$store.dispatch(LOGOUT)
         .then(() => {
            if(this.$route.name === 'home') window.location.reload();
            else this.$router.push({ name: 'home' });
         })
      },
      onMenuSelected(name) {
         this.$router.push({ name });
      },
      onActionSelected(name) {
         Bus.$emit(ACTION_SELECTED, name);
      }
   }
};
</script>

<style scoped>
.site-title{
   font-size : 1.6rem!important;
}
</style>