"use client"
// pages/Quiz.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { app, auth, db } from '../firebase/config'; // Update the path to firebase.js

function Quiz() {
  const searchParams = useSearchParams();
  const verseId = searchParams.get('verseId');
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20); // Timer in seconds
  const [timerId, setTimerId] = useState(null);



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
        setQuestions(data.questions.mcq); // Assuming you're using only MCQs for now
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
        // Handle error here
      }
    }

    if (verseId) {
      fetchQuestions();
    }
  }, [verseId]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;

    if (verseId && currentQuestionIndex >= questions.length - 1 && uid) {
      console.log('Verse ID:', verseId);
      console.log('Current Question Index:', currentQuestionIndex);
      console.log('Questions Length:', questions.length);
      const saveUserScore = async () => {
        const scoreRef = doc(collection(db, `scores/${verseId}/userScores`), uid);
        await setDoc(scoreRef, { score });
        console.log('User score saved.');
      };
      saveUserScore();
    }
  }, [verseId, currentQuestionIndex, questions.length, auth, db, score]);


  const maxTimer = 20;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        // Check if the timer has reached 0, then move to the next question
        if (prevTimer <= 0) {
          handleOptionClick(null); // Move to the next question without selecting an option
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
  

  
  useEffect(() => {
    if (timer === 0) {
      handleOptionClick(null);
    }
  }, [timer]);

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
  
    // Adjust the score for the first 5 seconds
    // if (timer > maxTimer - 5) {
    //   earnedScore = Math.max(earnedScore, 50); // Minimum score is 50
    // }

    setIsAnswerCorrect(isCorrect);
  
    if (isCorrect) {
      setScore((prevScore) => prevScore + earnedScore);
    }
  
    // Reset the timer and delay before moving to the next question
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
  
  

  

  const navigateToLeaderboard = () => {
    // Use Next.js Link to navigate to the leaderboard page
    window.location.href = `/Leaderboard?verseId=${verseId}`;
  };


  if (questions.length === 0) {
    return <p className="mt-4 text-center">Loading questions...</p>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className='flex justify-center h-screen p-4 m-5 bg-white'>
      <div className="flex flex-col items-center w-4/5 h-64 p-4 m-5 bg-gray-200 rounded shadow-md">
        <p className="p-5 m-4 text-2xl font-bold text-center">Your final score: {score}</p>
        <button
          className="p-2 mt-4 text-xl text-white bg-blue-500 rounded cursor-pointer"
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
    <div className="flex flex-col items-center h-screen p-4 bg-white ">
      <h1 className="p-6 m-2 my-4 text-3xl font-bold">Quiz for Verse: {verseId}</h1>

         {/* Timer display */}
         <div className="mb-2 text-lg font-semibold">{`Time Left: ${timer} seconds`}</div>
      


    

      <div key={currentQuestion.id} className="pt-4 bg-gray-200 rounded shadow-md md:w-4/5 ">
        
        <p className="p-5 m-4 text-xl font-semibold text-center md:text-2xl">{currentQuestion.question}</p>

         
          {/* Time slider */}
          <div className='m-2'>
            <div className="w-full mb-4 overflow-hidden bg-gray-200 rounded">
              <div
                className="p-2 transition-all ease-in-out bg-gradient-to-r from-green-300 to-green-500"
                style={{
                  width: `${(timer / 20) * 100}%`,
                  transition: 'width 1s ease-in-out', // Adjust the duration and easing as needed
                  borderRadius: '0.5rem', // Rounded corners
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Box shadow
                  height: '100%', // Full height of the parent container
                }}
              ></div>
            </div>
          </div>


     
        {currentQuestion.options.map((option, index) => (
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
        ))}
      </div>
   

      <p className="mt-4 text-lg font-semibold bg-white">Current Score: {score}</p>
    </div>
   
  );
}
export default Quiz;