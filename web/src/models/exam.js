class Exam {
   constructor(model) {
      for (let property in model) {
         this[property] = model[property];
      }

      if(model.isComplete) {
         let correctQuestions = [];
         let wrongQuestions = [];
         model.parts.forEach(part => {
            part.questions.forEach(question => {
               if(question.correct) correctQuestions.push(question);
               else wrongQuestions.push(question);
            })
         });
         this.correctQuestions = correctQuestions;
         this.wrongQuestions = wrongQuestions;
      }else {
         let hasAnswers = [];
         let noAnswers = [];
         model.parts.forEach(part => {
            part.questions.forEach(question => {
               if(question.userAnswerIndexes) {
                  //有答案
                  hasAnswers.push(question);
               }else noAnswers.push(question);
            })
         });
         this.hasAnswers = hasAnswers;
         this.noAnswers = noAnswers;
      }

      
      
   }

   
}

export default Exam;