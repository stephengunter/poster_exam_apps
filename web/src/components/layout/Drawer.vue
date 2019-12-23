<template>
   <v-navigation-drawer v-model="drawer" id="app-drawer" app>
      <div class="text-center mt-2">
         <v-avatar>
            <img :src="require('@/assets/logo.png')">
         </v-avatar>
      </div>
      
      

      <v-list dense>
         
         <v-list-item link>
            <v-list-item-action>
               <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
               <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
         </v-list-item>
         <v-list-item link>
            <v-list-item-action>
               <v-icon>mdi-contact-mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>
               <v-list-item-title>Contact</v-list-item-title>
            </v-list-item-content>
         </v-list-item>
      </v-list>
   </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { SITE_TITLE, LOGO_SRC } from '@/config';
import { SET_DRAWER, TOGGLE_DRAWER } from '@/store/mutations.type';

export default {
   name: 'TheDrawer',
   data(){
		return {
			
		}
   },
   computed: {
		...mapGetters(['isAuthenticated', 'responsive']), 
    	drawer: {
         get() {
            return this.$store.state.app.drawer
         },
         set(val) {
            this.setDrawer(val)
         }
		}
   },
   methods:{
      setDrawer(val) {
         this.$store.commit(SET_DRAWER, val);
      }
	}
}
</script>

<style>

</style>