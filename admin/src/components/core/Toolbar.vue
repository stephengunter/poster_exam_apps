<template>
	<v-toolbar id="core-toolbar" flat prominent style="background: #eee;">
    	<div class="v-toolbar-title">
			<v-toolbar-title class="tertiary--text font-weight-light">
				<v-btn v-if="responsive" class="default v-btn--simple" dark icon
				@click.stop="onClickBtn"
				>
				<v-icon>mdi-view-list</v-icon>
				</v-btn>
				{{ title }}
      	</v-toolbar-title>
    	</div>

    	<v-spacer />
    	<v-toolbar-items v-if="isAuthenticated">
			<v-flex align-center layout py-2>
				<router-link v-ripple class="toolbar-items" to="/">
					<v-icon color="tertiary">mdi-view-dashboard</v-icon>
				</router-link>
				<v-menu bottom left content-class="dropdown-menu" offset-y transition="slide-y-transition">
					<router-link v-ripple slot="activator" class="toolbar-items" to="/notifications">
						<v-badge color="error" overlap>
							<template slot="badge">
								{{ notifications.length }}
							</template>
							<v-icon color="tertiary">mdi-bell</v-icon>
						</v-badge>
					</router-link>
					<v-card v-show="notifications.length > 0">
						<v-list dense>
							<v-list-tile v-for="notification in notifications" :key="notification"
							@click="onClick"
							>
								<v-list-tile-title v-text="notification" />
							</v-list-tile>
						</v-list>
					</v-card>
				</v-menu>
				<v-menu offset-y>
               <v-btn v-if="responsive" dark flat slot="activator">
						<v-icon color="tertiary">mdi-account</v-icon>
               </v-btn>
					<v-btn v-else dark flat slot="activator" style="text-transform: lowercase">
                  <span class="mr-1" style="color: #000;">{{ user.email }}</span> 
                  <v-icon style="color: #000;">mdi-menu-down</v-icon>
               </v-btn>
               <v-card>
                  <v-list dense>
                     <v-list-tile @click.prevent="logout">
                        <v-list-tile-action>
                           <v-icon>mdi-logout-variant</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                           <v-list-tile-title>Log out</v-list-tile-title>
                        </v-list-tile-content>
                     </v-list-tile>
							<v-list-tile @click.prevent="profile">
                        <v-list-tile-action>
                           <v-icon>mdi-account</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                           <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile-content>
                     </v-list-tile>
                  </v-list>
               </v-card>
            </v-menu>
			</v-flex>
    	</v-toolbar-items>
  	</v-toolbar>
</template>

<script>

import { mapGetters } from 'vuex';
import { TOGGLE_DRAWER } from '@/store/mutations.type';
import { LOGOUT } from '@/store/actions.type';

export default {
	props:{
		title: {
			type: String,
         default: ''
		},
      user: {
         type: Object,
         default: null
      },
      responsive:{
         type: Boolean,
         default: false
      }
   },
	data(){
		return {
			notifications: [],
    		responsiveInput: false
		}
	},
	computed: {
      ...mapGetters(['isAuthenticated'])      
   },
  	methods:{
      onClickBtn(){
         this.$store.commit(TOGGLE_DRAWER);
      },
      onClick(){
         
      },
      logout(){
			this.$store.dispatch(LOGOUT)
			.then(() => this.$router.push({ path: '/login' }))
		},
		profile() {
			this.$router.push({ path: '/profile' });
		}
	}
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>
