// FillUpsQuestion.js
import React, { useState } from 'react';

function FillUpsQuestion({ question, handleAnswerSubmit }) {
  const [answer, setAnswer] = useState('');

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    handleAnswerSubmit(answer);
  };

  return (
    <div>
      <p>{question.question}</p>
      <input type="text" value={answer} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit Answer</button>
    </div>
  );
}

export default FillUpsQuestion;
