import { FOR_ALL, GUEST_ONLY, USER_ONLY } from './route.type';
import { SUBSCRIBER } from '@/consts';

const applinks = [{
   name: 'home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'main', show: FOR_ALL, order: 0
      }],
      icon: 'mdi-home',
      title: '首頁'
   } 
},
// {
//    name: 'test',
//    path: '/test',
//    view: 'test/Index',
//    parent: '',
//    meta: {
//       type: FOR_ALL,
//       menus: [],
//       title: 'Test'
//    } 
// },{
//    name: 'test-details',
//    path: '/test/details',
//    view: 'test/Details',
//    parent: 'test',
//    meta: {
//       type: FOR_ALL,
//       menus: [],
//       title: 'Test'
//    } 
// },
{
   name: 'contact',
   path: '/contact',
   view: 'Contact',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'footer', show: FOR_ALL
      }],
      title: '聯絡我們'
   } 
},{
   name: 'notices',
   path: '/notices',
   view: 'Notices',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'footer', show: FOR_ALL
      }],
      title: '公告訊息'
   } 
},{
   name: 'notice-details',
   path: '/notices/:id/:user?',
   view: 'notices/Details',
   props: true,
   parent: 'notices',
   meta: {
      type: FOR_ALL,
      menus: [],
      title: '公告訊息'
   } 
},{
   name: 'rqs',
   path: '/rqs',
   view: 'RQs',
   parent: '',
   order: 1,
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'main', show: FOR_ALL, order: 1
      }],
      icon: 'mdi-database',
      title: '歷屆試題'
   } 
},
{
   name: 'manuals',
   path: '/manuals',
   view: 'Manuals',
   parent: '',
   meta: {
      type: FOR_ALL,
      menus: [{
         key: 'main', show: FOR_ALL, order: 4
      }],
      icon: 'mdi-book-open',
      title: '使用說明'
   } 
}
];

const userLinks = [{
   name: 'subscribes',
   path: '/subscribes',
   view: 'Subscribes',
   parent: '',
   meta: {
      type: USER_ONLY,
      menus: [{
         key: 'user', show: USER_ONLY
      }],
      icon: 'mdi-wallet-membership',
      title: '我的訂閱'
   } 
},{
   name: 'notifications',
   path: '/notifications',
   view: 'Notifications',
   parent: '',
   meta: {
      type: USER_ONLY,
      menus: [{
         key: 'user', show: USER_ONLY
      }],
      icon: 'mdi-email-outline',
      title: '訊息通知'
   } 
},{
   name: 'notification-details',
   path: '/notifications/:id',
   view: 'notifications/Details',
   props: true,
   parent: 'notifications',
   meta: {
      type: FOR_ALL,
      menus: [],
      title: '訊息通知'
   } 
},{
   name: 'notes',
   path: '/notes',
   view: 'Notes',
   parent: '',
   meta: {
      type: USER_ONLY,
      menus: [{
         key: 'main', show: FOR_ALL, order: 3
      }],
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
      type: USER_ONLY,
      menus: [{
         key: 'main', show: FOR_ALL, order: 3
      }],
      icon: 'mdi-file-document-edit-outline',
      title: '模擬測驗'
   } 
},{
   name: 'exam-new',
   path: '/exams/new',
   view: 'exams/New',
   parent: 'exams',
   meta: {
      type: USER_ONLY,
      menus: [],
      title: '模擬測驗'
   } 
},{
   name: 'exam-edit',
   path: '/exams/edit/:id',
   view: 'exams/Edit',
   props: true,
   parent: 'exams',
   meta: {
      type: USER_ONLY,
      menus: [],
      title: '模擬測驗'
   } 
},{
   name: 'exam-details',
   path: '/exams/:id',
   view: 'exams/Details',
   props: true,
   parent: 'exams',
   meta: {
      type: USER_ONLY,
      menus: [],
      title: '模擬測驗'
   } 
},{
   name: 'subscribes-create',
   path: '/subscribes/create',
   view: 'subscribes/Create',
   parent: '',
   meta: {
      type: USER_ONLY,
      menus: [{
         key: 'main', show: FOR_ALL, except: SUBSCRIBER, order: 5
      }],
      icon: 'mdi-wallet-membership',
      title: '訂閱會員'
   } 
}];


const guestLinks = [{
   name: 'login',
   path: '/login',
   view: 'Login',
   meta: {
      type: GUEST_ONLY,
      menus: [{
         key: 'main', show: GUEST_ONLY, order: 6
      }],
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