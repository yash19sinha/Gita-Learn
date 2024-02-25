"use client";
// pages/Quiz.js
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { app, auth, db } from '../firebase/config'; // Update the path to firebase.js

function Quiz() {
  const searchParams = useSearchParams();
  const verseId = searchParams.get('verseId');
  const communityId = searchParams.get('communityId');
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState([]);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60); // Timer in seconds
  const [timerId, setTimerId] = useState(null);
  const [selectedFillUps, setSelectedFillUps] = useState(Array(0).fill(''));
  const selectedFillUpsRef = useRef(Array(0).fill(''));

 

  useEffect(() => {
    const auth = getAuth(app);

    // Check if the user is authenticated
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to the login page if the user is not authenticated
        router.push('/login');
        alert('Please login first.');
      }
    });

    return () => {
      unsubscribeAuth(); // Unsubscribe from onAuthStateChanged
      clearInterval(timerId); // Clear any existing timers
    };
  }, [router, timerId]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`https://gita-learn-api.vercel.app/api/questions/${verseId}`);
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
  
        let allQuestions = [];
  
        // Check if mcq questions exist, and add them to the array
        if (data.questions.mcq) {
          allQuestions = [...data.questions.mcq];
        }
  
        // Check if fillUps questions exist, and add them to the array
        if (data.questions.fillUps) {
          allQuestions = [...allQuestions, ...data.questions.fillUps];
        }
  
        setQuestions(allQuestions);
    
        // Initialize selectedFillUpsRef based on the first question
        if (allQuestions.length > 0 && allQuestions[0].type === 'fillUps') {
          selectedFillUpsRef.current = Array(allQuestions[0].correctAnswers.length).fill('');
        }
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
        // Handle error here
      }
    }
    
    if (verseId && verseId !== 'null') {
      fetchQuestions();
    }
    
  }, [verseId]);
  
  

  useEffect(() => {
    const uid = auth.currentUser?.uid;
  
    if (verseId && currentQuestionIndex >= questions.length - 1 && uid) {
      const saveUserScore = async () => {
        let collectionPath = '';
    
        if (communityId) {
          collectionPath = `communityScores/${communityId}/${verseId}/uid/userScores`;
        } else {
          collectionPath = `scores/${verseId}/userScores`;
        }
    
        try {
          const scoreRef = doc(collection(db, collectionPath), uid);
          await setDoc(scoreRef, { score });
          console.log('User score saved.');
        } catch (error) {
          console.error('Error saving user score:', error);
          // Handle error if necessary
        }
      };
      saveUserScore();
    }
    
  }, [verseId, communityId, currentQuestionIndex, questions.length, auth, db, score]);
  
  

  const maxTimer = 60;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        // Check if the timer has reached 0, then move to the next question
        if (prevTimer <= 0 && currentQuestion) {
          if (currentQuestion.type === 'fillUps') {
            handleFillUpsSubmit(); // Submit the fill-up answers
          } else {
            handleOptionClick(null); // Move to the next question without selecting an option
          }
          return maxTimer; // Reset the timer to maxTimer value
        }
  
        return prevTimer - 1;
      });
    }, 1000);
  
    // Save the timer ID to state for later cleanup
    setTimerId(intervalId);
  
    // Clear the timer when the component unmounts
    return () => {
      clearInterval(intervalId);
      setTimerId(null); // Clear the timer ID on unmount
    };
  }, [currentQuestionIndex, maxTimer]);
  
  const handleOptionClick = (selectedOption) => {
    // Clear the timer
    clearInterval(timerId);
  
    // Ensure that there are questions and currentQuestionIndex is within bounds
    if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
      console.log('Invalid question index or no questions found');
      return;
    }
  
    const currentQuestion = questions[currentQuestionIndex];
  
    // Ensure that currentQuestion and its properties are defined
    if (!currentQuestion || typeof currentQuestion.correctOption === 'undefined') {
      console.log('Invalid current question or no correct option found');
      return;
    }
  
    const isCorrect = selectedOption === currentQuestion.correctOption;
  
    setSelectedOption(selectedOption);
    const maxScore = 100;
    const earnedScore = isCorrect ? Math.max(50, Math.floor((timer / maxTimer) * maxScore)) : 0;
  
    setIsAnswerCorrect(isCorrect);
  
    if (isCorrect) {
      setScore((prevScore) => prevScore + earnedScore);
    }
  
    // Reset the timer and delay before moving to the next question
    setTimeout(() => {
      setTimer(maxTimer); // Reset the timer
      clearInterval(timerId); // Clear the timer interval
      setCurrentQuestionIndex((prevIndex) => {
        console.log('Moving to the next question. Prev index:', prevIndex);
        return prevIndex + 1;
      });
      setSelectedOption(null);
      setIsAnswerCorrect(null);
    }, 1500);
  };

  // Handle fill-up questions

  const handleFillUpsSubmit = () => {
    // Ensure that there are questions and currentQuestionIndex is within bounds
    if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
      console.log('Invalid question index or no questions found');
      return;
    }
  
    const currentQuestion = questions[currentQuestionIndex];
  
    // Ensure that currentQuestion and its properties are defined
    if (!currentQuestion || currentQuestion.type !== 'fillUps' || !Array.isArray(currentQuestion.correctAnswers)) {
      console.log('Invalid current question or no correct answers found');
      return;
    }
  
    // Use selectedFillUpsRef.current instead of selectedFillUps
    const isCorrect = currentQuestion.correctAnswers.every((correctAnswers, index) =>
      selectedFillUpsRef.current[index].toLowerCase().trim() === correctAnswers.toLowerCase().trim()
    );
  
    // Update the score based on correctness
    const maxScore = 100;
    const earnedScore = isCorrect ? Math.max(50, Math.floor((timer / maxTimer) * maxScore)) : 0;
  
    setIsAnswerCorrect(isCorrect);
  
    if (isCorrect) {
      setScore((prevScore) => prevScore + earnedScore);
    }
  
    // Reset the timer
    setTimer(maxTimer);
  
    // Delay before moving to the next question
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => {
        console.log('Moving to the next question. Prev index:', prevIndex);
        return prevIndex + 1;
      });
  
      // Clear the input values
      const newSelectedFillUps = Array(currentQuestion.correctAnswers.length).fill('');
      selectedFillUpsRef.current = newSelectedFillUps;
      setSelectedFillUps(newSelectedFillUps);
  
      setIsAnswerCorrect(null);
  
      // Set a new timer after a short delay to allow the UI to update
      const newTimerId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            handleOptionClick(null); // Move to the next question without selecting an option
            return maxTimer; // Reset the timer to maxTimer value
          }
          return prevTimer - 1;
        });
      }, 1000);
  
      // Save the new timer ID to state
      setTimerId(newTimerId);
    }, 1500);
  };
  
  
  
  
  
  
  const handleFillUpsInputChange = (e, index) => {
    const newAnswers = [...selectedFillUpsRef.current];
    newAnswers[index] = e.target.value;
    selectedFillUpsRef.current = newAnswers;
    setSelectedFillUps(newAnswers); // Update the state for re-render
  };
  
  
  

  const navigateToLeaderboard = () => {
    // Use Next.js router to navigate to the leaderboard page
    if (communityId) {
      window.location.href = `/Leaderboard?verseId=${verseId}&communityId=${communityId}`;
    } else {
      window.location.href = `/Leaderboard?verseId=${verseId}`;
    }
  };
  

  if (questions.length === 0) {
    return <p className="h-full mt-4 text-center ">Loading questions...</p>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className='flex justify-center h-full p-4 m-5 '>
        <div className="flex flex-col items-center w-4/5 h-64 p-4 m-5 bg-gray-200 rounded shadow-md">
          <p className="p-5 m-4 text-2xl font-bold text-center">Your final score: {score}</p>
          <button
            className="p-2 mt-4 text-xl text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
            onClick={navigateToLeaderboard}
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }
  

  const currentQuestion = questions[currentQuestionIndex];

  
  
  return (
    <div className="flex flex-col items-center h-full p-4   ">
    <h1 className="p-6 m-2 my-4 text-3xl font-bold">Quiz for Verse: {verseId}</h1>

    {/* Render questions based on type */}
    {currentQuestion && (
      <div key={currentQuestion.id} className="pt-4 bg-gray-300 rounded shadow-md md:w-4/5  dark:text-black">
        <p className="p-5 m-4 text-xl font-semibold text-center md:text-2xl">{currentQuestion.question}</p>

        {/* Time slider */}
        <div className='m-2'>
          <div className="w-full mb-4 overflow-hidden bg-gray-200 rounded">
            <div
              className="p-2 transition-all ease-in-out bg-gradient-to-r from-green-300 to-green-500"
              style={{
                width: `${(timer / 60) * 100}%`,
                transition: 'width 1s ease-in-out',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                height: '100%',
              }}
            ></div>
          </div>
        </div>

        {/* Render options or input based on question type */}
        {currentQuestion.type === 'mcq' ? (
        // Render multiple-choice options
        currentQuestion.options.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 m-2 rounded mb-2 font-medium md:text-lg text-sm ${
              selectedOption === index
                ? isAnswerCorrect
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-blue-400 text-white'
            }`}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </div>
        ))
      ) : currentQuestion.type === 'fillUps' ? (
        <div>
          {currentQuestion.correctAnswers.map((_, index) => (
            <div key={index}>
              <input
              type="text"
              placeholder={`Your Answer for Blank ${index + 1}`}
              value={selectedFillUpsRef.current[index] || ''}
              onChange={(e) => handleFillUpsInputChange(e, index)}
              className="p-4 m-2 mb-2 text-sm font-medium text-white bg-blue-400 rounded placeholder-slate-300 md:text-lg"

            />
            
            </div>
            
          ))}
          <button
            className="p-2 m-2 text-white bg-blue-400 rounded cursor-pointer hover:bg-blue-600"
            onClick={handleFillUpsSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <p>Unsupported question type</p>
      )}

      </div>
    )}

    {/* Current Score */}
    <p className="h-full mt-4 text-lg font-semibold ">Current Score: {score}</p>
  </div>
  );
}

export default Quiz;
