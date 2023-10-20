// components/Chapters.js
"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { Footer } from '../components/Footer';


function Chapters() {
  const searchParams = useSearchParams()
  const chapterNumber = searchParams.get('chapterNumber');
  const [chapters, setChapters] = useState([]);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [verses, setVerses] = useState([]);



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

  useEffect(() => {
    console.log('Chapter Number:', chapterNumber);
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
    } else {
      console.log('not working')

    }
  }, [chapterNumber]);



  return (
    <>
      <h1 className="pl-5 pr-5 my-4 text-4xl font-semibold text-center text-white bg-orange-400">
        Dive Into The Bhagavad Gita
      </h1>
      <div className="mb-4">
        <div className="flex justify-center pt-6 pb-6 bg-gray-50 ">
          <ul className='grid w-full grid-cols-1 gap-10 p-10 m-5 justify-items-center xl:max-w-screen-xl lg:max-w-screen-lg md:grid-cols-3'>
            {chapters.map((chapter) => (
              <li key={chapter.chapter_number} className="justify-center w-full mb-4 shadow-2xl card-body card bg-gray-50 outline-5">
                <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                  <h2 className="p-1 text-xl font-semibold">Chapter {chapter.chapter_number}</h2>
                  <p className="p-1 text-lg">{chapter.name}</p>
                
                </Link>

             
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      <Footer/>
    </>
  );

}

export default Chapters;