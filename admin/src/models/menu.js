export default class Menu {
   

   static mainMenus(routes, currentRoute){
      let mainLinks = this.getMainLinks(routes);
      mainLinks.forEach(item => {
         item.active =  (item.name === currentRoute.name);
         item.subs = this.getSubLinks(routes, item.name);
         item.subs.forEach(subItem => {
            subItem.active =  (subItem.name === currentRoute.name);
         });
      });

      return mainLinks;

   }

   
   
   static getMainLinks(routes){
      return routes.filter(item => item.meta.menu && !item.parent);
   }
   
   static getSubLinks(routes, parent){
      return routes.filter(item => item.meta.menu && item.parent === parent);
   }

   

   
}
