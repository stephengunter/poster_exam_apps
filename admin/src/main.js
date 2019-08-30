import Vue from 'vue';
window.Bus = new Vue({});

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.component('loading', Loading);

import '@/components';
import '@/plugins';
import router from '@/routes';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import JwtService from '@/services/jwt.service';
import { CHECK_AUTH } from '@/store/actions.type';
import { SET_MENUS } from '@/store/mutations.type';
import Menu from '@/common/menu';
import { FOR_ALL, GUEST_ONLY, ADMIN_ONLY } from '@/routes/route.type';


sync(store, router);

router.beforeEach((to, from, next) => {

	if(to.meta.type === FOR_ALL)  return next();

	store.dispatch(CHECK_AUTH).then(user => {
		if(user){ 
			if(to.meta.type === GUEST_ONLY){
				return next({ path: '/' });
			}

			let tokenStatus = JwtService.tokenStatus();
			if(tokenStatus === -1) {
				//token過期
				refreshToken(next, to);

			}else if(tokenStatus === 0) {
				//token 即將到期
				refreshToken(next, to);

			}else authDone(next, to);
			
		}else{
			//無token
			if(to.meta.type === GUEST_ONLY) return next();
			return next({ path: '/login' });
		}
	})
});

const authDone = (next, to) => {
	let mainMenus = Menu.getMainMenus(router.options.routes, to);
	store.commit(SET_MENUS, mainMenus);
	return next();
}

const refreshToken = (next, to) => next({ path: '/auth' , query:{ returnUrl: to.path }});

Vue.config.productionTip = false;

new Vue({
	router,
   store,
	render: h => h(App)
}).$mount('#app');
