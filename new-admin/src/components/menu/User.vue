<template>
   <v-menu v-if="user" offset-y>
      <template v-slot:activator="{ on }">
         <v-btn icon v-on="on">
            <v-avatar v-if="pictureError" size="36" color="indigo">
               <span class="cn">{{ user.name }}</span>
            </v-avatar>
            <v-avatar v-else size="36">
               <img :src="user.picture" @error="pictureError = true">
            </v-avatar>
         </v-btn>
      </template>
      <v-card class="mx-auto" max-width="300" tile >
         <v-list>
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
</template>

<script>
import { LOGOUT } from '@/store/actions.type';

export default {
   name: 'UserMenu',
   props: {
      user: {
         type: Object,
         default: null
      }
   },
   data() {
      return {
         pictureError: false
      }
   },
   methods:{
      logout(){
         this.$store.dispatch(LOGOUT)
         .then(() => {
            this.$router.push({ name: 'login' });
         })
      }
   }
}
</script>

<style>

</style>