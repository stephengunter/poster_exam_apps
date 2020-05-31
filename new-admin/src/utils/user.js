import { SUBSCRIBER, Dev, Boss } from '@/consts';

export const isSubscriber = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(SUBSCRIBER);
   return false;
}

export const isAdmin = (user) => {
   if(user.roles && user.roles.length) {
      let adminRoles = user.roles.filter(role => 
         role === Dev || role === Boss
      );
      if(adminRoles && adminRoles.length) return true;
      return false;
   }
   return false;
}