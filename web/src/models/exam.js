class Exam {
   constructor(model) {
      
      for (let property in model) {
         this[property] = model[property];
      }

      let partQuestions = model.parts.map(item => ({ questions: item.questions }));
     
      this.totalQuestions = partQuestions.reduce((a, b) => a.questions.length + b.questions.length); 
      
      let hasAnswers = 0;
      partQuestions.forEach(part => {
         part.questions.forEach(question => {
            if(question.userAnswerIndexes) hasAnswers += 1;
         })
      })

      this.hasAnswers = hasAnswers;
   }


}

export default Exam;