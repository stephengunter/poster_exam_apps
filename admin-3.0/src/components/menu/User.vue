<template>
   <v-menu v-if="user" offset-y>
      <template v-slot:activator="{ on }">
         <v-btn icon v-on="on">
            <v-avatar v-if="pictureError" size="36" color="indigo">
               <span style="color:white">{{ user.name }}</span>
            </v-avatar>
            <v-avatar v-else size="36">
               <img :src="user.picture" @error="pictureError = true">
            </v-avatar>
         </v-btn>
      </template>
      <v-list min-width="180" max-width="300">
         <v-list-item @click.prevent="logout">
            <v-list-item-icon >
               <v-icon class="mt-1">mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
               <v-list-item-title class="mt-1" style="font-size: 14px;">登出</v-list-item-title>
            </v-list-item-content>
         </v-list-item>
      </v-list>
   </v-menu>
</template>

<script>
import { LOGOUT } from '@/store/actions.type';

export default {
   name: 'MenuUser',
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
