// components/Question.js
import React, { useState } from 'react';

const Question = ({ question, onAnswerSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!question) {
    // Handle the case where the question prop is not defined
    return null;
  }

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleAnswerSubmit = () => {
    onAnswerSubmit(selectedOption);
  };

  return (
    <div key={question.id} className="pt-4 bg-gray-200 rounded shadow-md md:w-4/5 ">
      <p className="p-5 m-4 text-xl font-semibold text-center md:text-2xl">{question.question}</p>

      {question.type === 'mcq' ? (
        // Render MCQ options
        question.options.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 m-2 rounded mb-2 font-medium md:text-lg text-sm ${
              selectedOption === index ? 'bg-blue-400 text-white' : 'bg-gray-300 text-black'
            }`}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </div>
        ))
      ) : (
        // Render other question types here
        // Add logic for fill-ups or other question types
        <div>
          <input
            type="text"
            placeholder="Type your answer here"
            value={selectedOption || ''}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="p-4 m-2 mb-2 text-sm font-medium text-white bg-blue-400 rounded md:text-lg"
          />
          <button
            className="p-2 mt-2 text-xl text-white bg-green-500 rounded cursor-pointer hover:bg-green-700"
            onClick={handleAnswerSubmit}
          >
            Submit
          </button>
        </div>
      )}

      <button
        className="p-2 mt-2 text-xl text-white bg-green-500 rounded cursor-pointer hover:bg-green-700"
        onClick={handleAnswerSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default Question;
