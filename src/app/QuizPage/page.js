// pages/quiz/index.js
import React from 'react';
import Link from 'next/link';

const QuizPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-8 text-4xl font-bold">Quiz Options</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Option to Create a Quiz */}
        <Link href="QuizPage/CreateQuiz" className="p-6 text-white transition duration-300 bg-blue-500 rounded-md shadow-md hover:bg-blue-600">
      
            <h2 className="mb-4 text-2xl font-semibold">Create a Quiz</h2>
            <p>Create a new quiz and add questions for others to play.</p>
         
        </Link>

        {/* Option to Play a Quiz */}
        <Link href="/quiz/play" className="p-6 text-white transition duration-300 bg-green-500 rounded-md shadow-md hover:bg-green-600">
     
            <h2 className="mb-4 text-2xl font-semibold">Play a Quiz</h2>
            <p>Join an existing quiz and test your knowledge.</p>

        </Link>
      </div>
    </div>
  );
};

export default QuizPage;