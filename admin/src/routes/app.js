import { FOR_ALL, GUEST_ONLY, USER_ONLY, ADMIN_ONLY } from './route.type';

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
      name: 'pays',
      path: '/pays',
      view: 'Pays',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-cash-usd-outline',
         title: '付款',
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
         icon: 'mdi-file-document-box-outline',
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
   }
      
];

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

const userLinks = [];

let appRoutes = applinks.concat(adminlinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;