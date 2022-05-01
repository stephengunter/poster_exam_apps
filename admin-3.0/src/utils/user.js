import { BOSS, DEV, SUBSCRIBER } from '@/consts';

export const resolveUserFromClaims = (claims) => {
   return {
      id: claims.id,
      email: claims.sub,
      picture: claims.picture,
      name: claims.name,
      roles: claims.roles ? claims.roles.split(',') : []
   };
}

export const isBoss = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(BOSS);
   return false;
}

export const isDev = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(DEV);
   return false;
}

export const isSubscriber = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(SUBSCRIBER);
   return false;
}

export const isAdmin = (user) => {
   if(isDev(user)) return true;
   return isBoss(user);
}

export const getRoleColor = (role) => {
   if(role === BOSS || role === DEV) return 'red';
   else if(role === SUBSCRIBER) return 'green';
   else return '';
}