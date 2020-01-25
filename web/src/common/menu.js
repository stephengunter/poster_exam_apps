import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';

const getMainMenus = (appRoutes, currentRoute, auth) => {
   let routes = [];
   if(auth) {
      routes = appRoutes.filter(item => item.meta.show !== GUEST_ONLY);
   }else {
      routes = appRoutes.filter(item => item.meta.show !== USER_ONLY);
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

export default { getMainMenus };
