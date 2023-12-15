// pages/VerseDetail.js
"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import RenderPurport from '../components/RenderPurport'
import { useRouter } from 'next/navigation';

function VerseDetail() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const chapterVerse = searchParams.get('chapterVerse');
  const [verseDetails, setVerseDetails] = useState({});
  const [audioData, setAudioData] = useState({});

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

  const previousPage = () => {
  const chapterVerseNumber = parseFloat(chapterVerse);

  if (!isNaN(chapterVerseNumber) && chapterVerseNumber > 0.1) {
    const previousChapter = (chapterVerseNumber - 0.1).toFixed(1);
    window.location.href = `/VerseDetail?chapterVerse=${previousChapter}`;
  }
    

  }
  const nextPage = () => {
    const chapterVerseNumber = parseFloat(chapterVerse);
    
    // Navigate to the next chapter (add 1)
    if (!isNaN(chapterVerseNumber)) {
      const nextChapter = (chapterVerseNumber + 0.1).toFixed(1);
      // Use next/navigation or your preferred method to navigate to the next chapter
      // Replace 'your-route-here' with the actual route for VerseDetail
      window.location.href = `/VerseDetail?chapterVerse=${nextChapter}`;
    }
  }
  const redirectToQuiz = () => {
    // Redirect to the quiz page with the current chapterVerse as a query parameter
    router.push(`/Quiz?verseId=${chapterVerse}`);
  };


  return (
    <>
      


      <div className="p-4 ">
        <h1 className="flex justify-center pt-6 mb-4 text-3xl font-bold 32">Bg. {chapterVerse}</h1>
        <div className="flex justify-center mb-4">

          <p className="flex p-5 text-xl font-bold text-center w-80">{verseDetails.sanskrit_shlok}</p>
        </div>
        <div className="flex justify-center mb-4">

          <p className="flex p-3 text-xl italic text-center w-72">{verseDetails.english_shlok}</p>
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
        {RenderPurport(verseDetails)} {/* Conditionally render the Purport section */}
        {/* Display audio data */}
        {/* <div className="grid grid-cols-2 join"> */}
        <div className="p-4 flex justify-between mx-2.5 font-normal text-justify sm:mx-20 sm:px-10 ">

          <button onClick={previousPage} className=" join-item btn btn-outline">Previous page</button>
          <button onClick={nextPage} className="join-item btn btn-outline ">Next</button>
        </div>
            <div className="flex justify-center p-4">
            <button onClick={redirectToQuiz} className="btn btn-primary">
              Start Quiz
            </button>
            </div>

      </div>
      <Footer />
    </>

  );
}

export default VerseDetail;
