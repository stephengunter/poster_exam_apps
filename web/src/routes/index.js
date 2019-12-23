import Vue from 'vue';
import Router from 'vue-router';
import appRoutes from './app';

const mapRoute = (item) => {
	return { 
		...item,  
		component: (resolve) => import(
			`@/views/${item.view}.vue`
		).then(resolve)
	}
}

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: appRoutes.map(item => mapRoute(item)).concat([{
		path: '*', redirect: '/',
		meta: {}      
	}]),
	
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
		  return savedPosition
		}
		if (to.hash) {
		  return { selector: to.hash }
		}
		return { x: 0, y: 0 }
	}
})
