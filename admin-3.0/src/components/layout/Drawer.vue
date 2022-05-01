<template>
   <v-navigation-drawer id="app-drawer" v-model="drawer" 
   width="260" app dark 
   :expand-on-hover="expandOnHover" :right="$vuetify.rtl" mobile-breakpoint="960"
   v-bind="$attrs"
   >

   <v-list dense nav>
      <v-list-item> 
         <v-list-item-avatar class="align-self-center" color="white" contain>
            <v-img :src="require('@/assets/logo.png')" max-height="30" 
            />
         </v-list-item-avatar>
         <v-list-item-content>
            <v-list-item-title style="line-height: 1.5rem;">
               <h2>{{  title }}</h2>
            </v-list-item-title>
         </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list nav>
      <menu-drawer v-for="(item, index) in menus" :key="index" 
      :item="item"
      />
   </v-list>

   </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { SITE_TITLE } from '@/config';
import { SET_DRAWER } from '@/store/mutations.type';
export default {
   name: 'LayoutDrawer',
   props: {
      expandOnHover: {
        type: Boolean,
        default: false,
      }
   },
   data: () => ({
      title: SITE_TITLE
   }),
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
   methods:{
      setDrawer(val) {
         this.$store.commit(SET_DRAWER, val);
      }
	}
}
</script>

<style>

</style>