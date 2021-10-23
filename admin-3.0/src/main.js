import Vue from 'vue';
window.Bus = new Vue({});

import App from './App.vue';
import router from '@/routes';
import store from './store';
import vuetify from './plugins/vuetify';
import '@/plugins';
import '@/filters';
import '@/events';
import '@/components';

import JwtService from '@/services/jwt.service';
import { FOR_ALL, GUEST_ONLY } from '@/consts';
import { APP_CLOSED } from '@/config';
import { CHECK_AUTH, REFRESH_TOKEN } from '@/store/actions.type';
import { SET_MENUS } from '@/store/mutations.type';
import { getMainMenus } from '@/common/menu';

router.beforeEach((to, from, next) => {
	if(APP_CLOSED && to.name !== 'close') return redirect(next, { name: 'close' });
	
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
	let mainMenus = getMainMenus(router.options.routes, to, auth);
	store.commit(SET_MENUS, mainMenus);
	return next();
}

const refreshToken = (next, to) => {
	store.dispatch(REFRESH_TOKEN).then(token => {	
		if(token) return redirect(next, { path: to.path });
		else return redirect(next, { path: '/login' });
	})
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
