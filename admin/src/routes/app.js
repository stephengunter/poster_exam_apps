import { FOR_ALL, GUEST_ONLY, USER_ONLY, ADMIN_ONLY } from './route.type';

const applinks = [{
   name: 'Auth',
   path: '/auth',
   view: 'Auth',
   parent: '',
   meta: {
      
   } 
}];

const adminlinks = [
   {
      name: 'Auth',
      path: '/auth',
      view: 'Auth',
      parent: '',
      meta: {
      } 
   },
   {
      name: 'Dashboard',
      path: '/dashboard',
      view: 'Dashboard',
      parent: '',
      meta: {
         order: 0,
         icon: 'mdi-view-dashboard',
         title: 'Dashboard',
         type: '',
         menu: ''
      } 
   },
      
      
];

const guestLinks = [];

const userLinks = [];

let appRoutes = links.concat(guestLinks).concat(userLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;