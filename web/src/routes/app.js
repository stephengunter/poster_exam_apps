import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';

const applinks = [{
   name: 'home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: true,
      icon: 'mdi-home',
      title: '首頁'
   } 
},{
   name: 'test',
   path: '/test',
   view: 'Test',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: false,
      icon: 'mdi-home',
      title: 'Test'
   } 
},{
   name: 'rqs',
   path: '/rqs',
   view: 'RQs',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: true,
      icon: 'mdi-database',
      title: '歷屆試題'
   } 
},{
   name: 'exams',
   path: '/exams',
   view: 'Exams',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: true,
      icon: 'mdi-file-document-edit-outline',
      title: '模擬測驗'
   } 
}];

const userLinks = [];


const guestLinks = [{
   name: 'login',
   path: '/login',
   view: 'Login',
   meta: {
      icon: 'mdi-login-variant',
      title: '登入',
      type: GUEST_ONLY,
      menu: true
   } 
}];

let appRoutes = applinks.concat(userLinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;