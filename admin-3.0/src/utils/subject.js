export const findSubject = (subjectList, id) => {
   if(id) {
      let item = subjectList.find(x => x.id === id);
      if(item) return item;
      else {
         for(let i = 0; i < subjectList.length; i++) {
            item = subjectList[i].subItems.find(x => x.id === id);
            if(item) {
               return item;
               break;
            } 
         }
      }
   }else return null;
}