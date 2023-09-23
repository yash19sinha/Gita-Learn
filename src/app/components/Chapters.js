// components/Chapters.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
function Chapters() {
  const [chapters, setChapters] = useState([]);

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
  

  return (
    <div className="p-4">
      <h1 className="mb-4 text-3xl font-semibold">Bhagavad Gita Chapters</h1>
      <div className="flex justify-center pt-6 pb-6 bg-slate-200">
      <ul className='grid w-full grid-cols-1 gap-10 m-5 justify-items-center xl:grid-cols-2 xl:max-w-screen-xl lg:max-w-screen-lg'>
      
        {chapters.map((chapter) => (
          
          <li key={chapter.chapter_number} className="justify-center w-full mb-4 shadow-xl card-body card bg-base-100">
            
          <Link  href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
            <h2 className="p-1 text-xl font-semibold">Chapter {chapter.chapter_number}</h2>
            <p className="p-1 text-lg">{chapter.name}</p>
            <p className="p-1 text-sm text-gray-600">
            {truncateText(chapter.description, 40)} {/* Limit to 20 words */}
            </p>
          </Link>
         
          </li>
          
        
        ))}
      
      </ul>
      </div>
    </div>
    
  );
}

export default Chapters;
