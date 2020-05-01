import { SUBSCRIBER } from '@/auth/roles.type';

export const isSubscriber = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(SUBSCRIBER);
   return false;
}