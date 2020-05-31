<template>
   <v-navigation-drawer v-model="drawer" id="app-drawer" app>
      <div class="text-center mt-2">
         <v-avatar>
            <img :src="require('@/assets/logo.png')">
         </v-avatar>
      </div>
      <v-list nav dense>
         <core-drawer-menu v-for="(item, index) in menus" :key="index" 
         :item="item"
         />
      </v-list>
     
   </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Menu from '@/common/menu';
import { SET_DRAWER, TOGGLE_DRAWER } from '@/store/mutations.type';

export default {
   name: 'TheDrawer',
   data(){
		return {
			main: ''
		}
   },
   computed: {
		...mapGetters(['isAuthenticated', 'responsive', 'menus']),
    	drawer: {
         get() {
            return this.$store.state.app.drawer
         },
         set(val) {
            this.setDrawer(val)
         }
		}
   },
   beforeMount() {
     
      
   },
   methods:{
      setDrawer(val) {
         this.$store.commit(SET_DRAWER, val);
      },
      isActive(item) {
         if(item.active) return true;
         return false;
         // let subActive = item.subs.find(subItem => subItem.active);
         // if(subActive) return true;
         // return false;
      },
      linkTo(item) {
         console.log('linkTo', item);
         //console.log('main', this.main);

         //this.main = !this.main;
      },
      testSub(item) {
         console.log('testSub', item);
      }
	}
}
</script>

<style>

</style>