import Vue from 'vue';
window.Bus = new Vue({});

import VueQrcode from '@chenfengyuan/vue-qrcode';
Vue.component(VueQrcode.name, VueQrcode);

import App from './App.vue';
import router from './routes';
import store from './store';

import vuetify from './plugins/vuetify';
import './plugins/validate';
import './plugins/scroll-loader';

import '@/events';
import '@/components';
import '@/filters';

import JwtService from '@/services/jwt.service';
import { INIT, CHECK_AUTH, REFRESH_TOKEN, FETCH_ACTIONS } from '@/store/actions.type';
import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';
import { APP_CLOSED, SITE_TITLE } from '@/config';
import Menu from '@/common/menu';
import { SET_CURRENT_PAGE, SET_MENUS, SET_FOOTER_MENUS, SET_USER_MENUS,
	SET_AUTH_CHANGED
} from '@/store/mutations.type';

router.beforeEach((to, from, next) => {
	if(APP_CLOSED && to.name !== 'close') return redirect(next, { name: 'close' });

	store.dispatch(CHECK_AUTH).then(user => {

		if(to.meta.type === FOR_ALL) return authDone(next, to, user);
	
		if(user) {
			if(store.getters.authChanged) {
				store.commit(SET_AUTH_CHANGED, false);
				return refreshToken(next, to);
			}else {
				let tokenStatus = JwtService.tokenStatus();
				if(tokenStatus === -1) {
					//token過期
					return refreshToken(next, to);
				}else if(tokenStatus === 0) {
					//token 即將到期
					return refreshToken(next, to);
				}else {
					//token正常
					if(to.meta.type === GUEST_ONLY) return redirect(next, { path: '/' });
					else return authDone(next, to, user);
				}
			}
		}else{
			//無token
			
			if(to.meta.type === GUEST_ONLY) return authDone(next, to, user);
			else {
				let query = { ...to.query, returnUrl: to.path };
				return redirect(next, { path: '/login', query });
			} 
		}
	})
});

router.afterEach((to, from) => {
	if(to.meta.title) {
		document.title = `${SITE_TITLE} - ${to.meta.title}`;
	}else {
		document.title = SITE_TITLE;
	}
	
	store.commit(SET_CURRENT_PAGE, to);
})

const redirect = (next, route) => next(route);

const authDone = (next, to, user = null) => {

	let mainMenus = Menu.getMainMenus(router.options.routes, to, user);
	store.commit(SET_MENUS, mainMenus);

	let footerMenus = Menu.getFooterMenus(router.options.routes, to, user);	
	store.commit(SET_FOOTER_MENUS, footerMenus);

	if(user) {
		let userMenus = Menu.getUserMenus(router.options.routes, to, user);
		store.commit(SET_USER_MENUS, userMenus);
	}

	store.dispatch(INIT);
	store.dispatch(FETCH_ACTIONS, to);
	return next();
}

const refreshToken = (next, to) => {
	store.dispatch(REFRESH_TOKEN)
	.then(token => {	
		if(token) return redirect(next, { path: to.path });
		else {
			let query = { ...to.query, returnUrl: to.path };
			return redirect(next, { path: '/login', query });
		}
	})
}

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
