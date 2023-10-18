// pages/VerseDetail.js
"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

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
    <div className=''>
      <div className="p-4 ">
      <h1 className="flex justify-center mb-4 text-3xl font-semibold">Bg. {chapterVerse}</h1>
      <div className="mb-4">
        
        <p className="flex justify-center text-lg">{verseDetails.sanskrit_shlok}</p>
      </div>
      <div className="mb-4">
      
        <p className="flex justify-center text-lg italic">{verseDetails.english_shlok}</p>
      </div>
      <div className="mb-4">
        <h2 className="flex justify-center text-xl font-semibold ">Synonyms</h2>
        <p className="flex justify-center text-lg ">{verseDetails.synonyms}</p>
      </div>
      <div className="mb-4">
        <h2 className="flex justify-center text-xl font-semibold ">Translation</h2>
        <p className="flex justify-center text-lg font-bold">{verseDetails.translation}</p>
      </div>
      <div>
        <h2 className="flex justify-center text-xl font-semibold ">Purport</h2>
        <p className="flex justify-center text-lg ">{verseDetails.purport}</p>
      </div>
      {/* Display audio data */}
      <div className="mb-4">
          <h2 className="flex justify-center text-xl font-semibold ">Audio</h2>
          {audioData.audioUrl && (
            <div className="flex items-center justify-center">
              <audio controls className="w-full">
                <source src={audioData.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

        </div>
    </div>
  </div>
  </>
  
  );
}

export default VerseDetail;
