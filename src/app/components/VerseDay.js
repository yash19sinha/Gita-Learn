import React, { useEffect, useState } from 'react';

function VerseDay() {
  const [verse, setVerse] = useState(null);


  useEffect(() => {
    async function fetchVerseOfDay() {
      try {
        const response = await fetch('http://localhost:4000/api/verse-of-the-day');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Assuming that data.verse is the key of the verse you want to display
        const verseText = data.verse ? data.verse.sanskrit_shlok : 'Verse not found';

        setVerse(verseText);
      } catch (error) {
        console.error('Error fetching verse of the day:', error);
        // Handle error here
      }
    }

    fetchVerseOfDay();
  }, []);

  return (
    <div className='flex'>
    <div className="justify-center w-full p-4 px-48 m-4 mx-6 rounded-lg shadow-lg card-body card bg-gray-50">
    <h2 className="mb-2 text-xl font-semibold">Verse of the Day</h2>
    {verse ? (
      <div>
        <p className="text-gray-700">{verse}</p>
      </div>
    ) : (
      <p className="text-gray-700">Loading verse of the day...</p>
    )}
  </div>
  </div>
  
  );
}

export default VerseDay;
