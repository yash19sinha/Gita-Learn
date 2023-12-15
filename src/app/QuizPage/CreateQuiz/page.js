"use client"
import { useState, useEffect } from 'react';
import { auth, db } from '@/app/firebase/config';
import { addDoc, collection, serverTimestamp, writeBatch } from 'firebase/firestore';
import Link from 'next/link';


const createDefaultQuestion = () => {
  
  
  return {
    question: '',
    options: ['', '', '', ''],
    correctOption: 0,
  };
};

const CreateQuiz = () => {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([createDefaultQuestion()]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleQuestionChange = (question) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestionIndex] = question;
      return newQuestions;
    });
  };

  const handleOptionChange = (optionIndex, option) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestionIndex].options[optionIndex] = option;
      return newQuestions;
    });
  };

  const handleCorrectOptionChange = (correctOption) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestionIndex].correctOption = correctOption;
      return newQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [...prevQuestions, createDefaultQuestion()]);
    setCurrentQuestionIndex(questions.length);
  };

  const handleSubmit = async () => {
    
    try {
      const quizRef = collection(db, 'quizzes');
  
      // Use a Firestore batch to write multiple documents atomically
      const batch = writeBatch(db);
  
      // Add quiz document
      console.log('Before quizDocRef');
        const quizDocRef = addDoc(quizRef, {
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        });
        
    console.log('After quizDocRef');
  
      // Get the quiz ID
      const quizId = (await quizDocRef).id;
      console.log('Quiz ID:', quizId);

      
  
      // Create an array to store promises for each question addition
      const questionPromises = questions.map(async (question, index) => {
        const questionRef = collection(db, 'quizzes', quizId, 'questions');
        const questionData = {
          question: question.question,
          options: question.options,
          correctOption: question.correctOption,
        };
        const questionDocRef = await addDoc(questionRef, questionData);
        batch.set(questionDocRef, questionData);
        return questionDocRef; // Return the promise
      });
      
      // Wait for all question addition promises to resolve
      const questionResults = await Promise.all(questionPromises);
      
  
      // Wait for all question addition promises to resolve
      await Promise.all(questionPromises);
  
      // Commit the batch write
      await batch.commit();
  
      // Generate a game pin
      const gamePin = quizId.substring(0, 6).toUpperCase(); // Use the first 6 characters of the quiz ID
      console.log('Game Pin:', gamePin);
  
      // Redirect to a confirmation or management page with the game pin
      console.log('Redirect to:', `/quiz/${gamePin}`);
      // You might need to use Next.js router for navigation
      // router.push(`/quiz/${gamePin}`);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };
  return (
    <>
    <h1 className="flex items-center justify-center m-8 text-4xl font-bold">Create Quiz</h1>
    <div className="flex flex-col ">
      

      <div className="flex p-5">
        <div className="w-64 pr-4">
          <h2 className="mb-4 text-2xl font-bold">Questions</h2>
          <ul className="space-y-4">
            {questions.map((_, index) => (
              <li key={index} className="text-lg">
                <Link href="#" className={`text-blue-500 ${index === currentQuestionIndex ? 'font-bold' : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}>
                 
                    {`Question ${index + 1}`}
                  
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4">
          <div key={currentQuestionIndex} className="space-y-2">
            <label className="block">
              {`Question ${currentQuestionIndex + 1}:`}
              <input
                type="text"
                className="w-full p-2 mt-1 border rounded"
                value={questions[currentQuestionIndex].question}
                onChange={(e) => handleQuestionChange({ ...questions[currentQuestionIndex], question: e.target.value })}
              />
            </label>

            {questions[currentQuestionIndex].options.map((option, optionIndex) => (
              <label key={optionIndex} className="block">
                {`Option ${optionIndex + 1}:`}
                <input
                  type="text"
                  className="w-full p-2 mt-1 border rounded"
                  value={option}
                  onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                />
              </label>
            ))}

            <label className="block">
              Correct Option:
              <select
                className="w-full p-2 mt-1 border rounded"
                value={questions[currentQuestionIndex].correctOption}
                onChange={(e) => handleCorrectOptionChange(parseInt(e.target.value, 10))}
              >
                {questions[currentQuestionIndex].options.map((_, i) => (
                  <option key={i} value={i}>
                    {`Option ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            className="p-2 text-white transition duration-300 bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>

          <button
            className="p-2 text-white transition duration-300 bg-green-500 rounded-md shadow-md hover:bg-green-600"
            onClick={handleSubmit}
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateQuiz;