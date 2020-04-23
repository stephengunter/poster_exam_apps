import { FOR_ALL, GUEST_ONLY, USER_ONLY } from '@/routes/route.type';
import { isSubscriber } from '@/utils';

const getMainMenus = (appRoutes, currentRoute, user = null) => {
   let mainLinks = getMainLinks(appRoutes, user);
   mainLinks.forEach(item => {
      item.active = (item.name === currentRoute.name);
   });

   return mainLinks;
}

const getUserMenus = (appRoutes, currentRoute, user) => {
   return getUserLinks(appRoutes, user);
}


const getMainLinks = (routes, user = null) => routes.filter(item => {
   let menus = item.meta.menus;
   if(menus && menus.length) {
      let mainMenu = menus.find(x => x.key === 'main');
      if(!mainMenu) return false;

      if(user) {
         if(isSubscriber(user)) {
            return mainMenu.show !== GUEST_ONLY;
         }else {
            return mainMenu.show !== GUEST_ONLY;
         }
      }else {
         return mainMenu.show !== USER_ONLY;
      }
      
   }
   return false;
});

const getUserLinks = (routes, user) => routes.filter(item => {
   let menus = item.meta.menus;
   if(menus && menus.length) {
      let userMenu = menus.find(x => x.key === 'user');
      if(!userMenu) return false;

      if(isSubscriber(user)) {
         return userMenu.show !== GUEST_ONLY;
      }else {
         return userMenu.show !== GUEST_ONLY;
      }
      
   }
   return false;
});

const getSubLinks = (routes, parent) => routes.filter(item => item.parent === parent);

export default { getMainMenus, getUserMenus };
