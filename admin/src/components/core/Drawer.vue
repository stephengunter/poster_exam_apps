<template>
	<v-navigation-drawer id="app-drawer" app dark floating
		persistent mobile-break-point="991"
		v-model="inputValue" width="260"	
	>
		
		<v-layout class="fill-height" tag="v-list" column>
			<v-list-tile to="/" avatar >
				<v-list-tile-avatar color="white">
					<v-img :src="logo_src" height="34" contain />
				</v-list-tile-avatar>
				<v-list-tile-title class="title">
					Quantium Admin
				</v-list-tile-title>
			</v-list-tile>
			
			<v-divider/>

			<core-drawer-menu v-for="(item, index) in mainMenus" :key="index" 
            :item="item" :color="color"
         />
			
			<div v-if="false">
				<v-list-tile v-for="(link, i) in links" :key="i"
				:to="link.to" :active-class="color" avatar class="v-list-item"
				>
					<v-list-tile-action>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-tile-action>
					<v-list-tile-title v-text="link.text" />
				</v-list-tile>
			</div>
			

			<v-list-tile v-if="false" disabled active-class="primary" class="v-list-item v-list__tile--buy" 
			to="/upgrade"
			>
				<v-list-tile-action>
					<v-icon>mdi-package-up</v-icon>
				</v-list-tile-action>
				<v-list-tile-title class="font-weight-light">
					Upgrade To PRO
				</v-list-tile-title>
			</v-list-tile>
		</v-layout>
	</v-navigation-drawer>
</template>

<script>
import { SITE_TITLE, LOGO_SRC } from '@/config';
import Menu from '@/models/menu';
import { SET_DRAWER, TOGGLE_DRAWER } from '@/store/mutations.type';

export default {
	name:'Drawer',
	props:{
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
			logo_src: LOGO_SRC,
			mainMenus:[]
		}
   },
   computed: {
    	inputValue: {
         get () {
            return this.$store.state.app.drawer
         },
         set (val) {
            this.setDrawer(val)
         }
      }
	},
	watch: {
      '$route' (){
         this.initRoute();
      }
   },
	beforeMount(){
      this.title = SITE_TITLE;
      this.initRoute();
	},
  	methods:{
		initRoute(){
         this.mainMenus = Menu.mainMenus(this.$router.options.routes, this.$route);
      },
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
