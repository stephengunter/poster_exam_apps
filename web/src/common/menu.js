import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';
import { isSubscriber } from '@/utils';

const getMainMenus = (appRoutes, currentRoute, user = null) => {
  
   let routes = [];
   if(user) {
      routes = appRoutes.filter(item => item.meta.show && item.meta.show !== GUEST_ONLY);
      if(isSubscriber(user)) {
         //如果已經是Subscriber, 菜單不顯示 '訂閱會員'
         let idx = routes.findIndex(item => item.name === 'subscribes');
         if(idx > -1) routes.splice(idx, 1);
      }
      
   }else {
      routes = appRoutes.filter(item => item.meta.show  && item.meta.show !== USER_ONLY);
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
