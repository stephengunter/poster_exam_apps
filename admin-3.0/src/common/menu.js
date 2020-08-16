import { GUEST_ONLY, ADMIN_ONLY } from '@/consts';

export const getMainMenus = (appRoutes, currentRoute, auth) => {
   let routes = [];
   if(auth) {
      routes = appRoutes.filter(item => item.meta.type !== GUEST_ONLY);
   }else {
      routes = appRoutes.filter(item => item.meta.type !== ADMIN_ONLY);
   }
   
   let mainLinks = getMainLinks(routes);
   mainLinks.forEach(item => {
      item.active =  (item.name === currentRoute.name);
      item.subs = getSubLinks(routes, item.name);
      item.subs.forEach(subItem => {
         subItem.active =  (subItem.name === currentRoute.name);
      });
   });

   return mainLinks;
}

const getMainLinks = (routes) => routes.filter(item => item.meta.menu && !item.parent);

const getSubLinks = (routes, parent) => routes.filter(item => item.meta.menu && item.parent === parent);