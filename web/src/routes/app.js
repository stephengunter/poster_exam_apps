import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';

const applinks = [{
   name: 'Home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: false
   } 
},{
   name: 'Auth',
   path: '/auth',
   view: 'Auth',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: false
   } 
},{
   name: 'Forbidden',
   path: '/forbidden',
   view: 'Forbidden',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: false
   }
}];

const userLinks = [{
   name: 'Exam',
   path: '/exam',
   view: 'Exam',
   parent: '',
   meta: {
      type: USER_ONLY,
      menu: true
   } 
}];


const guestLinks = [{
   name: 'Login',
   path: '/login',
   view: 'Login',
   parent: 'Dashboard',
   meta: {
      icon: 'mdi-cloud-outline',
      title: 'Login',
      type: GUEST_ONLY,
      menu: true
   } 
}];

let appRoutes = applinks.concat(userLinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;