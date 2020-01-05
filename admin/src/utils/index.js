export const resolveErrorData = (error) => {
   console.log(error);
   if(!error) return null;
   if(error.status && error.status === 400) return error.data;
   return null; 
}

export const onError = (error) => {
   console.log(error);
   Bus.$emit('errors');
}

export const activeOptions = () => {
   return [{
      value: true,
      text: '上架中'
   },{
      value: false,
      text: '已下架'
   }];
}

export const hasIntersection = (arrA, arrB) => arrA.some((val) => arrB.indexOf(val) !== -1);

export const noIntersection = (arrA, arrB) => !hasIntersection(arrA, arrB)

export * from './helper';