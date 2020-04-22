export const isSubscriber = (user) => {
   if(user.roles) return user.roles.includes('Subscriber');
   return false;
}