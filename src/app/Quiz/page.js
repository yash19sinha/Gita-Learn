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


  useEffect(() => {
    const auth = getAuth(app);

    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to the login page if the user is not authenticated
        
        router.push('/login');
        alert('Please login first.');
      }
    });

    return () => unsubscribe();
  }, [router]);

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        if (verseId && currentQuestionIndex >= questions.length - 1) {
          console.log('Verse ID:', verseId); // Log the verseId for debugging
          const saveUserScore = async () => {
            const scoreRef = doc(collection(db, `scores/${verseId}/userScores`), uid);
            await setDoc(scoreRef, { score });
          };
          saveUserScore();
        }
      }
    });

    return () => unsubscribe();
  }, [verseId, currentQuestionIndex, questions.length, auth, db, score]);

  const handleOptionClick = (selectedOption) => {
    setSelectedOption(selectedOption);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctOption;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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

      <div key={currentQuestion.id} className="w-4/5 pt-4 bg-gray-200 rounded shadow-md ">
        <p className="p-5 m-4 text-2xl font-semibold text-center">{currentQuestion.question}</p>
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 m-2 rounded mb-2 font-medium ${
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
   

      <p className="mt-4 text-lg font-semibold">Current Score: {score}</p>
    </div>
   
  );
}

export default Quiz;
