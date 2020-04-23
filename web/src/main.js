import Vue from 'vue';
window.Bus = new Vue({});

import VueQrcode from '@chenfengyuan/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);

import App from './App.vue';
import router from './routes';
import store from './store';
import vuetify from './plugins/vuetify';

import './plugins/validate';
import '@/events';
import '@/components';
import '@/filters';

import JwtService from '@/services/jwt.service';
import { CHECK_AUTH, REFRESH_TOKEN, FETCH_ACTIONS } from '@/store/actions.type';
import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';
import Menu from '@/common/menu';
import { SET_MENUS, SET_USER_MENUS } from '@/store/mutations.type';

router.beforeEach((to, from, next) => {
	store.dispatch(CHECK_AUTH).then(user => {
		
		if(to.meta.type === FOR_ALL) return authDone(next, to, user);
	
		if(user){
			let tokenStatus = JwtService.tokenStatus();
			if(tokenStatus === -1) {
				//token過期
				return refreshToken(next, to);
			}else if(tokenStatus === 0) {
				//token 即將到期
				return refreshToken(next, to);
			}else {
				if(to.meta.type === GUEST_ONLY) return redirect(next, { path: '/' });
				else return authDone(next, to, user);
			}
			
		}else{
			//無token
			let query = { ...to.query, returnUrl: to.path };
			if(to.meta.type === GUEST_ONLY) return authDone(next, to, user);
			else return redirect(next, { path: '/login', query });
		}
	})
});

const redirect = (next, route) => next(route);

const authDone = (next, to, user = null) => {
	let mainMenus = Menu.getMainMenus(router.options.routes, to, user);
	store.commit(SET_MENUS, mainMenus);

	if(user) {
		let userMenus = Menu.getUserMenus(router.options.routes, to, user);
		store.commit(SET_USER_MENUS, userMenus);
	}
	
	store.dispatch(FETCH_ACTIONS, to);
	return next();
}

const refreshToken = (next, to) => {
	store.dispatch(REFRESH_TOKEN)
	.then(token => {	
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
