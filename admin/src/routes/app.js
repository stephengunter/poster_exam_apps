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
      name: 'subDashboard',
      path: '/subdashboard',
      view: 'SubDashboard',
      parent: 'dashboard',
      meta: {
         order: 0,
         icon: 'mdi-city-variant-outline',
         title: 'SubDashboard',
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
         icon: 'mdi-note-text-outline',
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
         icon: 'mdi-database-check',
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