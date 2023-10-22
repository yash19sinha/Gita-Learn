// components/Chapters.js
"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';


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

      <Navbar/>
      <div className="p-4 mt-4 bg-white">
      <h1 className="flex justify-center pt-5 mb-4 text-4xl font-bold">
      Bhagavad Gita as it is

      </h1>
      <div className="mb-4">
        <div className="items-start overflow-x-auto md:m-10 ">
          <ul className='gap-10 p-3 m-5  sm:p-6 justify-items-center'>
            {chapters.map((chapter) => (
              <li key={chapter.chapter_number} className="justify-center w-full mb-4 ">
                <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                  <h3 className="py-3 text-xl font-medium text-justify sm:mx-20 sm:px-10 hover:bg-gray-100">Chapter {chapter.chapter_number}: {chapter.name}</h3>
                 
                
                </Link>

             
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      </div>
      <Footer/>
    </>
  );

}

export default Chapters;