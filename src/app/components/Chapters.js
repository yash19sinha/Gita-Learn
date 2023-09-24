// components/Chapters.js
import { useEffect, useState } from 'react';
import Link from 'next/link';

function Chapters() {
  const [chapters, setChapters] = useState([]);
  const [showAllChapters, setShowAllChapters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:4000/api/chapters');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChapters(data.chapters);
      } catch (error) {
        console.error('Error fetching chapters with descriptions:', error);
        // Handle error here
      }
    }
    fetchData();
  }, []);

  function truncateText(text, maxLength) {
    const words = text.split(' ');
    if (words.length <= maxLength) {
      return text;
    }
    const truncatedWords = words.slice(0, maxLength);
    return `${truncatedWords.join(' ')}...`;
  }

  const chaptersToShow = showAllChapters ? chapters : chapters.slice(0, 5);

  return (
    <div className="p-4">
      <h1 className="p-5 m-4 mb-4 text-5xl font-semibold text-center text-white bg-orange-400">
        Dive Into The Bhagavad Gita
      </h1>
      <div className="flex justify-center pt-6 pb-6 ">
        <ul className='grid w-full grid-cols-1 gap-10 p-10 m-5 justify-items-center xl:max-w-screen-xl lg:max-w-screen-lg'>
          {chaptersToShow.map((chapter) => (
            <li key={chapter.chapter_number} className="justify-center w-full mb-4 shadow-2xl card-body card bg-base-100">
              <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                <h2 className="p-1 text-xl font-semibold">Chapter {chapter.chapter_number}</h2>
                <p className="p-1 text-lg">{chapter.name}</p>
                <p className="p-1 text-sm text-gray-600">{truncateText(chapter.description, 40)}</p>
              </Link>
            </li>
          ))}
        </ul>
        
      </div>
       <div className='flex justify-center'>
          {!showAllChapters && (
              <button onClick={() => setShowAllChapters(true)} className="p-3 m-2 text-xl text-white bg-blue-500 rounded-md w-72 hover:bg-blue-600">
                View All 18 Chapters
              </button>
            )}
      </div>
    </div>
  );
}

export default Chapters;
