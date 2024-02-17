// pages/VerseDetail.js
"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import RenderPurport from '../components/RenderPurport'
import { useRouter } from 'next/navigation';
import NotesSidebar from '../components/NotesSidebar';
import { FaPenSquare } from "react-icons/fa";
import PublicNotes from "../components/PublicNotes"
import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getFirestore } from 'firebase/firestore';



function VerseDetail() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const chapterVerse = searchParams.get('chapterVerse');
  const [verseDetails, setVerseDetails] = useState({});
  const [audioData, setAudioData] = useState({});
  const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);
  const [communityId, setCommunityId] = useState('');
  const [isCreatingCommunityId, setIsCreatingCommunityId] = useState(false);
  const [generatedCommunityId, setGeneratedCommunityId] = useState('');
  const [questionsExist, setQuestionsExist] = useState(false);






  const handleToggleNotesSidebar = () => {
    setIsNotesSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    async function fetchVerseDetails() {
      try {
        const response = await fetch(`https://gita-learn-api.vercel.app/api/verse/${chapterVerse}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setVerseDetails(data.verseDetails);
      } catch (error) {
        console.error('Error fetching verse details:', error);
        // Handle error here
      }
    }

    async function fetchAudioData() {
      try {
        const response = await fetch(`https://gita-learn-api.vercel.app/api/audio/${chapterVerse}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAudioData(data.audio);
      } catch (error) {
        console.error('Error fetching audio data:', error);
        // Handle error here
      }
    }

    if (chapterVerse) {
      fetchVerseDetails();
      fetchAudioData();

    }
  }, [chapterVerse]);

  const fetchVerseNumbers = async () => {
    try {
      const response = await fetch('https://gita-learn-api.vercel.app/api/verseNumbers');
      if (!response.ok) {
        throw new Error('Failed to fetch verse numbers');
      }
      const data = await response.json();
      return data.verseNumbers;
    } catch (error) {
      console.error('Error fetching verse numbers:', error);
      return [];
    }
  };

  // Function to handle previous button click
  const handlePreviousPage = async () => {
    try {
      const verseNumbers = await fetchVerseNumbers();
      const currentIndex = verseNumbers.indexOf(chapterVerse);
      if (currentIndex > 0) {
        const previousChapterVerse = verseNumbers[currentIndex - 1];
        router.push(`/VerseDetail?chapterVerse=${previousChapterVerse}`);
      } else {
        console.log('No previous verse available');
      }
    } catch (error) {
      console.error('Error navigating to previous verse:', error);
    }
  };

  // Function to handle next button click
  const handleNextPage = async () => {
    try {
      const verseNumbers = await fetchVerseNumbers();
      const currentIndex = verseNumbers.indexOf(chapterVerse);
      if (currentIndex < verseNumbers.length - 1) {
        const nextChapterVerse = verseNumbers[currentIndex + 1];
        router.push(`/VerseDetail?chapterVerse=${nextChapterVerse}`);
      } else {
        console.log('No next verse available');
      }
    } catch (error) {
      console.error('Error navigating to next verse:', error);
    }
  };
  
  
  
  const redirectToQuiz = () => {
    // Check if chapterVerse is a valid value before redirecting
    if (chapterVerse) {
      // Redirect to the quiz page with the current chapterVerse as a query parameter
      router.push(`/Quiz?verseId=${chapterVerse}`);
    } else {
      console.error('Invalid chapterVerse:', chapterVerse);
      // Handle the case where chapterVerse is null or invalid
    }
  };

  const handleCreateCommunityId = async () => {
    try {
      const communityIdRef = doc(collection(getFirestore(), 'communityIds'));
      const communityIdSnapshot = await getDoc(communityIdRef);
  
      if (communityIdSnapshot.exists()) {
        alert('Community ID already exists. Try entering the existing ID.');
      } else {
        const newCommunityId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit ID
        setGeneratedCommunityId(newCommunityId);
  
        setIsCreatingCommunityId(true);
  
        const communityData = {
          communityId: newCommunityId,
          verseId: chapterVerse,
        };
  
        await addDoc(collection(getFirestore(), 'communityIds'), communityData);
  
        console.log('Community ID created:', communityData);
      }
    } catch (error) {
      console.error('Error creating community ID:', error);
      // Handle error here
    }
  };

  
  const handleEnterCommunityId = async () => {
    if (!communityId) {
      alert('Please enter a Community ID.');
      return;
    }
  
    // Check if the entered community ID exists in the collection
    const communityPinRef = collection(db, 'communityIds');
    const communityPinQuery = query(communityPinRef, where('communityId', '==', parseInt(communityId))); // Assuming 'communityId' is the field where the pin is stored
    const communityPinSnapshot = await getDocs(communityPinQuery);
  
    if (!communityPinSnapshot.empty) {
      // The entered community ID exists in the collection
      const currentVerseId = chapterVerse;
      setIsCreatingCommunityId(false);
      router.push(`/Quiz?verseId=${currentVerseId}&communityId=${communityId}`);
    } else {
      // The entered community ID does not exist in the collection
      alert('Community ID does not exist. Please enter a valid ID.');
    }
  };
  

  async function fetchQuestions(chapterVerse) {
    try {
      const response = await fetch(`https://gita-learn-api.vercel.app/api/questions/${chapterVerse}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      return data.questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return null;
    }
  }

  
  
  // Define a function to check if questions exist for a given chapterVerse
// Define a function to check if any type of questions exist for a given chapterVerse
async function checkQuestionsExist(chapterVerse) {
  const questions = await fetchQuestions(chapterVerse);
  return questions && questions.fillUps && questions.fillUps.length > 0;

}
  
  
  // Use the useEffect hook to fetch questions and update questionsExist state
  useEffect(() => {
    async function updateQuestionsExist() {
      if (chapterVerse) {
        console.log('Fetching questions for chapter verse:', chapterVerse);
        const exist = await checkQuestionsExist(chapterVerse);
        setQuestionsExist(exist);
      }
    }
    updateQuestionsExist();
  }, [chapterVerse]);

  



  return (
    <>
      


      <div className="p-4 ">
        <h1 className="flex justify-center pt-6 mb-4 text-3xl font-bold 32">Bg. {chapterVerse}</h1>
        
        <div className="flex justify-center mb-4" style={{whiteSpace: 'pre-line'}}>

          <p className="flex p-5 text-xl font-bold text-center w-100">{verseDetails.sanskrit_shlok}</p>
        </div>
        <div className="flex justify-center mb-4" style={{whiteSpace: 'pre-line'}}>

          <p className="flex p-3 text-xl italic text-center w-100">{verseDetails.english_shlok}</p>
        </div>
        <div className="p-4 mb-4 font-normal text-justify sm:mx-20 sm:px-10">
          <h2 className="flex justify-center text-xl font-semibold ">Audio</h2>
          {audioData.audioUrl && (
            <div className="flex items-center justify-center p-5">
              <audio controls className="w-96">
                <source src={audioData.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

        </div>
        <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 ">
          <h2 className="flex justify-center p-3 text-2xl font-bold">Synonyms</h2>
          <p className="flex justify-center p-3 text-lg ">{verseDetails.synonyms}</p>
        </div>
        <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10">
          <h2 className="flex justify-center p-3 text-2xl font-bold ">Translation</h2>
          <p className="flex justify-center p-3 text-lg font-semibold">{verseDetails.translation}</p>
        </div>
        {RenderPurport(verseDetails)} 
        {/* Conditionally render the Purport section */}
        {/* Display audio data */}
        {/* <div className="grid grid-cols-2 join"> */}
        <div className="p-4 flex justify-between mx-2.5 font-normal text-justify sm:mx-20 sm:px-10">
          <button onClick={handlePreviousPage} className="join-item btn btn-outline">Previous page</button>
          <button onClick={handleNextPage} className="join-item btn btn-outline">Next</button>
        </div>
        
        <div className="flex justify-center p-4">
  {questionsExist && (
    <button onClick={redirectToQuiz} className="text-white bg-orange-400 btn">
      Start Quiz
    </button>
  )}
</div>

{questionsExist && (
  <div className="flex justify-center p-4 space-x-4">
    {!isCreatingCommunityId ? (
      <div>
        <button onClick={handleCreateCommunityId} className="text-white bg-orange-400 btn">
          Create a Community ID
        </button>
      </div>
    ) : (
      <div>
        <button onClick={() => setIsCreatingCommunityId(false)} className="text-white bg-orange-400 btn">
          Back
        </button>
      </div>
    )}
  </div>
)}

{isCreatingCommunityId && (
  <div className="flex justify-center p-4">
    <div>
      <p className="text-lg">Community ID: {generatedCommunityId}</p>
    </div>
  </div>
)}

{questionsExist && !isCreatingCommunityId && (
  <div className="flex justify-center p-4">
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Enter Community ID"
        value={communityId}
        onChange={(e) => setCommunityId(e.target.value)}
        className="w-64 px-4 py-2 text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <button onClick={handleEnterCommunityId} className="text-white bg-orange-400 btn">
        Enter
      </button>
    </div>
  </div>
)}

      

        

    

            
            <button
              onClick={handleToggleNotesSidebar}
              className="fixed px-4 py-2 text-3xl text-white bg-blue-500 shadow rounded-3xl bottom-4 right-4 hover:bg-blue-600"
            >
             <FaPenSquare />
            </button>

            {isNotesSidebarOpen && (
              <NotesSidebar onClose={handleToggleNotesSidebar} />
            )}
            <PublicNotes verseId={chapterVerse} />
          
      </div>
      <Footer />
    </>

  );
}

export default VerseDetail;
