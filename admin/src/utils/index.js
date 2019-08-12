export const resolveErrorData = (error) => {
   console.log(error);
   if(!error) return null;
   if(error.status && error.status === 400) return error.data;
   return null; 
}

export * from './helper';