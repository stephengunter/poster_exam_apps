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
        
];

const guestLinks = [];

const userLinks = [];

let appRoutes = applinks.concat(adminlinks).concat(guestLinks);

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i;
}

export default appRoutes;