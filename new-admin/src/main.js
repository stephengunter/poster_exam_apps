import Vue from 'vue';
window.Bus = new Vue({});

import vuetify from './plugins/vuetify';
//import './plugins/validate';

import '@/events';
import '@/components';
import '@/filters';



import App from './App.vue';
import router from './routes';
import store from './store';

import JwtService from '@/services/jwt.service';
import { CHECK_AUTH, REFRESH_TOKEN } from '@/store/actions.type';
import { SET_MENUS, SET_CURRENT_PAGE } from '@/store/mutations.type';
import Menu from '@/common/menu';
import { FOR_ALL, GUEST_ONLY, ADMIN_ONLY } from '@/routes/route.type';


router.beforeEach((to, from, next) => {
	store.dispatch(CHECK_AUTH).then(auth => {
		
		if(to.meta.type === FOR_ALL) return authDone(next, to, auth);
	
		if(auth){ 
			if(to.meta.type === GUEST_ONLY) return redirect(next, { path: '/' });

			let tokenStatus = JwtService.tokenStatus();
			if(tokenStatus === -1) {
				//token過期
				return refreshToken(next, to);

			}else if(tokenStatus === 0) {
				//token 即將到期
				return refreshToken(next, to);

			}else return authDone(next, to, auth);
			
		}else{
			//無token
			if(to.meta.type === GUEST_ONLY) return authDone(next, to, auth);
			else return redirect(next, { path: '/login' });
		}
	})
});

const redirect = (next, route) => next(route);

const authDone = (next, to, auth = false) => {
	let routes = router.options.routes;

	let mainMenus = Menu.getMainMenus(routes, to, auth);
	
	//let currentRoute = mainMenus.find(item => item.active);
	//console.log('currentRoute', currentRoute);
	// if(currentRoute) currentRoute.active = true;
	// else {
	// 	currentRoute = routes.find(item => item.name === to.name);
	// 	currentRoute.active = true;
	// 	let parent = mainMenus.find(item => item.name === currentRoute.parent);
	// 	if(parent) {
	// 		currentRoute.parentPage = parent;
	// 		parent.active = true;
	// 	} 
	// }
	
	store.commit(SET_MENUS, mainMenus.items);
	store.commit(SET_CURRENT_PAGE, mainMenus.current);
	return next();
}

const refreshToken = (next, to) => {
	store.dispatch(REFRESH_TOKEN).then(token => {	
		if(token) return redirect(next, { path: to.path });
		else return redirect(next, { path: '/login' });
	})
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
