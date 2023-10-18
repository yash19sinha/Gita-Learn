// pages/VerseDetail.js
"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';

function VerseDetail() {
    const searchParams = useSearchParams()
    const chapterVerse = searchParams.get('chapterVerse');
    const [verseDetails, setVerseDetails] = useState({});
    const [audioData, setAudioData] = useState({});

  useEffect(() => {
    async function fetchVerseDetails() {
      try {
        const response = await fetch(`http://localhost:4000/api/verse/${chapterVerse}`);

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
        const response = await fetch(`http://localhost:4000/api/audio/${chapterVerse}`);
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


  

  return (
    <>
    <Navbar/>
    
      <div className="p-4 ">
      <h1 className="flex justify-center pt-6 mb-4 text-3xl font-bold 32">Bg. {chapterVerse}</h1>
      <div className="flex justify-center mb-4">
        
        <p className="flex p-5 text-xl text-center w-80">{verseDetails.sanskrit_shlok}</p>
      </div>
      <div className="flex justify-center mb-4">
      
        <p className="flex p-3 text-xl italic text-center w-72">{verseDetails.english_shlok}</p>
      </div>
      <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 ">
        <h2 className="flex justify-center p-3 text-2xl font-bold">Synonyms</h2>
        <p className="flex justify-center p-3 text-lg ">{verseDetails.synonyms}</p>
      </div>
      <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10">
        <h2 className="flex justify-center p-3 text-2xl font-bold ">Translation</h2>
        <p className="flex justify-center p-3 text-lg font-semibold">{verseDetails.translation}</p>
      </div>
      <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10">
        <h2 className="flex justify-center p-3 text-2xl font-bold">Purport</h2>
        <p className="flex justify-center p-3 text-lg">{verseDetails.purport}</p>
      </div>
      {/* Display audio data */}
      <div className="p-4 mb-4 font-normal text-justify sm:mx-20 sm:px-10">
          <h2 className="flex justify-center text-xl font-semibold ">Audio</h2>
          {audioData.audioUrl && (
            <div className="flex items-center justify-center p-5">
              <audio controls className="w-full">
                <source src={audioData.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

        </div>
    </div>
  
  </>
  
  );
}

export default VerseDetail;
