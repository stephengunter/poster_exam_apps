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
   view: 'Test',
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
},{
   name: 'notes',
   path: '/notes',
   view: 'Notes',
   parent: '',
   meta: {
      show: FOR_ALL,
      type: FOR_ALL,
      menu: true,
      icon: 'mdi-notebook-outline',
      title: '讀書筆記'
   } 
}];

const userLinks = [
//    {
//    name: 'notes',
//    path: '/notes',
//    view: 'Notes',
//    parent: '',
//    meta: {
//       show: FOR_ALL,
//       type: USER_ONLY,
//       menu: true,
//       icon: 'mdi-notebook-outline',
//       title: '讀書筆記'
//    } 
// },
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