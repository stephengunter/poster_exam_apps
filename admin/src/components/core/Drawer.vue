<template>
	<v-navigation-drawer id="app-drawer" app dark floating
		persistent mobile-break-point="991"
		v-model="inputValue" width="260"	
	>
		
		<v-layout class="fill-height" tag="v-list" column>
			<v-list-tile to="/" avatar >
				<v-list-tile-avatar color="white">
					<v-img :src="require('@/assets/logo.png')" height="34" contain />
				</v-list-tile-avatar>
				<v-list-tile-title class="title">
					{{ site_title }}
				</v-list-tile-title>
			</v-list-tile>
			
			<v-divider/>
			<div v-if="isAuthenticated">
				<core-drawer-menu  v-for="(item, index) in menus" :key="index" 
					:item="item" :color="color"
				/>
			</div>
			
			
		</v-layout>
	</v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { SITE_TITLE, LOGO_SRC } from '@/config';
import { SET_DRAWER, TOGGLE_DRAWER } from '@/store/mutations.type';

export default {
	name:'Drawer',
	props:{
		menus: {
         type: Array,
         default: null
      },
      color: {
         type: String,
         default: 'info'
      },
      responsive:{
         type: Boolean,
         default: false
      }
	},
	data(){
		return {
			site_title: SITE_TITLE
		}
   },
   computed: {
		...mapGetters(['isAuthenticated']), 
    	inputValue: {
         get () {
            return this.$store.state.app.drawer
         },
         set (val) {
            this.setDrawer(val)
         }
		}
	},
	beforeMount(){
      this.title = SITE_TITLE;
	},
  	methods:{
      setDrawer(val){
         this.$store.commit(SET_DRAWER, val);
      },
      toggleDrawer(){
         this.$store.commit(TOGGLE_DRAWER);
		}
	}
}
</script>

<style lang="scss">
#app-drawer {
	.v-list__tile {
		border-radius: 4px;

		&--buy {
		margin-top: auto;
		margin-bottom: 17px;
		}
	}

	.v-image__image--contain {
		top: 9px;
		height: 60%;
	}

	.search-input {
		margin-bottom: 30px !important;
		padding-left: 15px;
		padding-right: 15px;
	}

	div.v-responsive.v-image > div.v-responsive__content {
		overflow-y: auto;
	}
}
</style>
