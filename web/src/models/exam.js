class Exam {
   constructor(model) {
      for (let property in model) {
         this[property] = model[property];
      }

      this.partQuestions = model.parts.map(item => ({ questions: item.questions }));
     
      this.totalQuestions = this.partQuestions.reduce((a, b) => a.questions.length + b.questions.length); 
      
   }

   get hasAnswers() {
      let count = 0;
      this.partQuestions.forEach(part => {
         part.questions.forEach(question => {
            if(question.userAnswerIndexes) count += 1;
         })
      })
      return count;
   }

   
}

export default Exam;