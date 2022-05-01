export const validReferenceType = (val) => {
   if(val.toLowerCase() === 'term') return true;
   if(val.toLowerCase() === 'note') return true;
   return false;
} 

export const isValidReference = (item) => {
   if(!item.id) return false;
   if(!validReferenceType(item.type)) return false;
   return true;
}