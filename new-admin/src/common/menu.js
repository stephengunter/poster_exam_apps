import { GUEST_ONLY, ADMIN_ONLY } from '@/routes/route.type';

const getMainMenus = (appRoutes, currentRoute, auth) => {
   let routes = [];
   if(auth) {
      routes = appRoutes.filter(item => item.meta.type !== GUEST_ONLY);
   }else {
      routes = appRoutes.filter(item => item.meta.type !== ADMIN_ONLY);
   }
   
   let mainLinks = getMainLinks(routes);
   let currentPage = null;
   mainLinks.forEach(item => {
      if(item.name === currentRoute.name) {
         item.active = true;
         currentPage = item;
      }
      
      item.subs = getSubLinks(routes, item.name);
      item.subs.forEach(subItem => {
         if(subItem.name === currentRoute.name) {
            subItem.active = true;
            subItem.parentPage = item;
            currentPage = subItem;
         }
      });
   });

   return { items: mainLinks, current: currentPage };
}

const getMainLinks = (routes) => routes.filter(item => item.meta.menu && !item.parent);

const getSubLinks = (routes, parent) => routes.filter(item => item.meta.menu && item.parent === parent);

export default { getMainMenus };
