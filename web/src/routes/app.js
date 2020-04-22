import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';

const applinks = [{
   name: 'home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      show: FOR_ALL,
      type: FOR_ALL,
      menu: true,
      icon: 'mdi-home',
      title: '首頁'
   } 
},{
   name: 'test',
   path: '/test',
   view: 'test/Test',
   parent: '',
   meta: {
      show: FOR_ALL,
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
      show: FOR_ALL,
      type: FOR_ALL,
      menu: true,
      icon: 'mdi-database',
      title: '歷屆試題'
   } 
}];

const userLinks = [
   {
   name: 'notes',
   path: '/notes',
   view: 'Notes',
   parent: '',
   meta: {
      show: FOR_ALL,
      type: USER_ONLY,
      menu: true,
      icon: 'mdi-notebook-outline',
      title: '讀書筆記'
   } 
},
{
   name: 'exams',
   path: '/exams',
   view: 'Exams',
   parent: '',
   meta: {
      show: FOR_ALL,
      type: USER_ONLY,
      menu: true,
      icon: 'mdi-file-document-edit-outline',
      title: '模擬測驗'
   } 
},{
   name: 'bills',
   path: '/bills',
   view: 'Bills',
   parent: '',
   meta: {
      show: '',
      type: USER_ONLY,
      menu: false,
      icon: 'mdi-wallet-membership',
      title: '訂閱會員'
   } 
},{
   name: 'subscribes',
   path: '/subscribes',
   view: 'Subscribes',
   parent: '',
   meta: {
      show: FOR_ALL,
      type: USER_ONLY,
      menu: true,
      icon: 'mdi-wallet-membership',
      title: '訂閱會員'
   } 
},{
   name: 'subscribes-create',
   path: '/subscribes/create',
   view: 'subscribes/Create',
   parent: '',
   meta: {
      show: '',
      type: USER_ONLY,
      menu: false,
      icon: 'mdi-wallet-membership',
      title: '訂閱會員'
   } 
}];


const guestLinks = [{
   name: 'login',
   path: '/login',
   view: 'Login',
   meta: {
      show: GUEST_ONLY,
      type: GUEST_ONLY,
      icon: 'mdi-login-variant',
      title: '登入',
      menu: true
   } 
}];

let appRoutes = applinks.concat(userLinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;