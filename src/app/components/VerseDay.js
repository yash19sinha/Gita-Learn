import React, { useEffect, useState } from 'react';

const RandomVerseCard = () => {
  const [randomVerse, setRandomVerse] = useState(null);

  useEffect(() => {
    async function fetchRandomVerse() {
      try {
        const response = await fetch('http://localhost:4000/api/verses/random');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Random Verse Data:', data.verse);
        // Handle the retrieved verse data
      } catch (error) {
        console.error('Error fetching random verse:', error);
        // Handle the error
      }
    }
    fetchRandomVerse();
  }, []);
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Random Verse</h2>
      {randomVerse ? (
        <div>
          <p>Chapter {randomVerse.chapter_number}</p>
          <p>Verse {randomVerse.verse_number}</p>
          <p>{randomVerse.text}</p>
        </div>
      ) : (
        <p>Loading random verse...</p>
      )}
    </div>
  );
};

export default RandomVerseCard;
