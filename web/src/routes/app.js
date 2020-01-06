import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';

const applinks = [{
   name: 'Home',
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
   name: 'Test',
   path: '/test',
   view: 'Test',
   parent: '',
   meta: {
      type: FOR_ALL,
      menu: false,
      icon: 'mdi-home',
      title: 'Test'
   } 
}];

const userLinks = [{
   name: 'Exam',
   path: '/exam',
   view: 'Exam',
   parent: '',
   meta: {
      type: USER_ONLY,
      menu: true,
      icon: 'mdi-file-document-edit-outline',
      title: '模擬測驗'
   } 
},{
   name: 'RQs',
   path: '/rqs',
   view: 'RQs',
   parent: '',
   meta: {
      type: USER_ONLY,
      menu: true,
      icon: 'mdi-database',
      title: '歷屆試題'
   } 
}];


const guestLinks = [{
   name: 'Login',
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