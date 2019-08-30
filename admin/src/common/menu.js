import { FOR_ALL, GUEST_ONLY, USER_ONLY, ADMIN_ONLY } from '@/routes/route.type';

const forAllRoute = (route) => route.meta.type === FOR_ALL;

const getMainMenus = (routes, currentRoute) => {
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
