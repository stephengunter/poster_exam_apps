import { FOR_ALL, GUEST_ONLY, USER_ONLY, ADMIN_ONLY } from '@/consts';

const applinks = [];

const adminlinks = [
   {
      name: 'dashboard',
      path: '/dashboard',
      view: 'Dashboard',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-view-dashboard',
         title: 'Dashboard',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'messages',
      path: '/messages',
      view: 'Messages',
      parent: 'dashboard',
      meta: {
         order: 0,
         icon: 'mdi-mail',
         title: 'Messages',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'notices',
      path: '/notices',
      view: 'Notices',
      parent: 'dashboard',
      meta: {
         order: 0,
         icon: 'mdi-bulletin-board',
         title: '公告訊息',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'exceptions',
      path: '/exceptions',
      view: 'Exceptions',
      parent: 'dashboard',
      meta: {
         order: 0,
         icon: 'mdi-alert-circle',
         title: 'Exceptions',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'subscribes',
      path: '/subscribes',
      view: 'Subscribes',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-credit-card-check-outline',
         title: '訂閱',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'plans',
      path: '/plans',
      view: 'Plans',
      parent: 'subscribes',
      meta: {
         order: 0,
         icon: 'mdi-text-box-outline',
         title: '方案',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'bills',
      path: '/bills',
      view: 'Bills',
      parent: 'subscribes',
      meta: {
         order: 0,
         icon: 'mdi-credit-card-multiple',
         title: '帳單',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'bill-details',
      path: '/bills/:id',
      view: 'bills/Details',
      props: true,
      parent: 'subscribes',
      meta: {
         order: 0,
         title: '帳單',
         type: ADMIN_ONLY,
         menu: false
      } 
   },
   {
      name: 'pays',
      path: '/pays',
      view: 'Pays',
      parent: 'subscribes',
      meta: {
         order: 0,
         icon: 'mdi-cash-check',
         title: '付款',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'users',
      path: '/users',
      view: 'Users',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-account',
         title: '用戶',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'recruits',
      path: '/recruits',
      view: 'Recruits',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-file-document-edit-outline',
         title: '招考',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'subjects',
      path: '/subjects',
      view: 'Subjects',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-view-list',
         title: '科目',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'terms',
      path: '/terms',
      view: 'Terms',
      parent: 'subjects',
      meta: {
         order: 0,
         icon: 'mdi-file-document-outline',
         title: '條文課綱',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'notes',
      path: '/notes',
      view: 'Notes',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-notebook-outline',
         title: '筆記',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'questions',
      path: '/questions',
      view: 'Questions',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-database-edit',
         title: '題庫',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'recruitQuestions',
      path: '/recruit-questions',
      view: 'RecruitQuestions',
      parent: 'questions',
      meta: {
         order: 0,
         icon: '',
         title: '歷屆試題',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'question-analysis',
      path: '/question-analysis',
      view: 'QuestionAnalysis',
      parent: 'questions',
      meta: {
         order: 0,
         icon: '',
         title: '試題分析',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'manuals',
      path: '/manuals',
      view: 'Manuals',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-book-open',
         title: '手冊',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'articles',
      path: '/articles',
      view: 'Articles',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-post-outline',
         title: '文章管理',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'db',
      path: '/db',
      view: 'DB',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-database',
         title: '數據庫',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'data',
      path: '/data',
      view: 'Data',
      parent: 'db',
      meta: {
         order: 0,
         icon: 'mdi-database-sync',
         title: 'Data',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'settings',
      path: '/settings',
      view: 'Settings',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-cog-outline',
         title: '設定',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'attachments',
      path: '/attachments',
      view: 'Attachments',
      parent: 'settings',
      meta: {
         order: 0,
         icon: 'mdi-folder-image',
         title: 'Attachments',
         type: ADMIN_ONLY,
         menu: true
      } 
   },
   {
      name: 'profile',
      path: '/profile',
      view: 'Profile',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-account',
         title: 'Profile',
         type: ADMIN_ONLY,
         menu: false
      } 
   },
   {
      name: 'close',
      path: '/close',
      view: 'Close',
      parent: '',
      meta: {
         type: FOR_ALL,
         menus: [],
         icon: '',
         title: '系統維護中'
      } 
   }
];

const guestLinks = [{
   name: 'Login',
   path: '/login',
   view: 'Login',
   parent: 'Dashboard',
   meta: {
      icon: 'mdi-login-variant',
      title: 'Login',
      type: GUEST_ONLY,
      menu: true
   } 
}];

let appRoutes = applinks.concat(adminlinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;