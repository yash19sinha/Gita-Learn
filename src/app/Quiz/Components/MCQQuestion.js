// Quiz/Components/MCQQuestion.js
import React from 'react';

function MCQQuestion({ question, handleOptionClick }) {
  return (
    <div>
      <p>{question.question}</p>
      {question.options.map((option, index) => (
        <div key={index} onClick={() => handleOptionClick(index)}>
          {option}
        </div>
      ))}
    </div>
  );
}

export default MCQQuestion;
