// pages/ChapterInfo.js
"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';


function ChapterInfo() {
  const searchParams = useSearchParams()
  const chapterNumber = searchParams.get('chapterNumber');
  const [verses, setVerses] = useState([]);

  useEffect(() => {
    async function fetchVerses() {
      try {
        const response = await fetch(`http://localhost:4000/api/verses/${chapterNumber}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Chapter Number:', chapterNumber);
        console.log('Verses Data:', data.verses);
        setVerses(data.verses);
      } catch (error) {
        console.error('Error fetching verses:', error);
        // Handle error here
      }
    }
    if (chapterNumber) {
      fetchVerses();
    }else{
        console.log('not working')
    }
  }, [chapterNumber]);



  
  

  return (
    
    <div className="p-4 bg-gray-100">
        
    
      <h1 className="mb-4 text-2xl font-bold">Chapter {chapterNumber} Information</h1>
     
      
      
      <h2 className="mb-2 text-xl font-semibold">Verses</h2>
      <div className="items-center justify-center overflow-x-auto md:m-10">
  <table className="min-w-full mb-4 bg-white rounded shadow-md">
    {/* Table head */}
    <thead>
        <tr>
          <th className="px-4 py-2 font-semibold text-center border-b-2 border-gray-300">Verse Number</th>
          <th className="px-4 py-2 font-semibold text-center border-b-2 border-gray-300">Text</th>
        </tr>
    </thead>
    <tbody>
      {verses.map((verse) => (
        <tr key={verse.verse_number} className="text-center hover:bg-gray-100">
          
            <td className="px-4 py-2">{verse.verse_number}</td>         
          
            <td className="px-4 py-2">
            <Link href={`/VerseDetail?chapterVerse=${chapterNumber}.${verse.verse_number}`}>
              {verse.text}
            </Link>
            </td>
          
        </tr>
      ))}
      </tbody>
    </table>
  </div>




      
      
    </div>
  );
}

export default ChapterInfo;
