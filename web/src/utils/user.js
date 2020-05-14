import { SUBSCRIBER } from '@/consts';

export const isSubscriber = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(SUBSCRIBER);
   return false;
}