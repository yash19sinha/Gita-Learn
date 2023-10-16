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
    <div className="p-4">
    <h1 className="mb-4 text-3xl font-semibold">Verse {chapterVerse} Details</h1>
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Sanskrit Shlok</h2>
      <p className="text-lg">{verseDetails.sanskrit_shlok}</p>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold">English Shlok</h2>
      <p className="text-lg">{verseDetails.english_shlok}</p>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Synonyms</h2>
      <p className="text-lg">{verseDetails.synonyms}</p>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Translation</h2>
      <p className="text-lg">{verseDetails.translation}</p>
    </div>
    <div>
      <h2 className="text-xl font-semibold">Purport</h2>
      <p className="text-lg">{verseDetails.purport}</p>
    </div>
     {/* Display audio data */}
     <div className="mb-4">
        <h2 className="text-xl font-semibold">Audio</h2>
        {audioData.audioUrl && (
          <audio controls>
            <source src={audioData.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
  </div>
  
  
  );
}

export default VerseDetail;
