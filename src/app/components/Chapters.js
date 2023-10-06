// components/Chapters.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles

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




  function truncateText(text, maxLength) {
    const words = text.split(' ');
    if (words.length <= maxLength) {
      return text;
    }
    const truncatedWords = words.slice(0, maxLength);
    return `${truncatedWords.join(' ')}...`;
  }

  const chaptersToShow = showAllChapters ? chapters : chapters.slice(0, 8);

  return (
    <>
      <h1 className="p-5 my-4 text-5xl font-semibold text-center text-white bg-orange-400">
        Dive Into The Bhagavad Gita
      </h1>
      <div className="mb-4">
        <div className="flex justify-center pt-6 pb-6 bg-gray-50 ">
          <ul className='grid w-full grid-cols-1 gap-10 p-10 m-5 justify-items-center xl:max-w-screen-xl lg:max-w-screen-lg md:grid-cols-3'>
            {chaptersToShow.map((chapter) => (
              <li key={chapter.chapter_number} className="justify-center w-full mb-4 shadow-2xl card-body card bg-gray-50 outline-5">
                <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                  <h2 className="p-1 text-xl font-semibold">Chapter {chapter.chapter_number}</h2>
                  <p className="p-1 text-lg">{chapter.name}</p>
                  <p className="p-1 text-sm text-gray-600">{truncateText(chapter.description, 40)}</p>
                </Link>

                {/* Swiper slider for verses */}
                <Swiper
                  spaceBetween={10}
                  slidesPerView={3} // Change the number of slides per view as per your design
                  navigation
                  className="my-4"
                >
                  {chapter.verses && chapter.verses.slice(0, 5).map((verse) => (
                    <SwiperSlide key={verse.verse_number}>
                      <div className="p-4 bg-white rounded shadow-md">
                        <h3 className="text-xl font-semibold">Verse {verse.verse_number}</h3>
                        <p className="text-lg">{verse.text}</p>
                      </div>
                    </SwiperSlide>
                  ))}
                  {/* You can add more slides here */}
                </Swiper>
                {/* Add a "See All Verses" button if there are more verses */}
                {chapter.verses && chapter.verses.length > 8 && (
                  <button
                    onClick={() => setShowAllChapters(true)}
                    className="p-3 m-2 text-xl text-white bg-blue-500 rounded-md w-72 hover:bg-blue-600"
                  >
                    See All Verses
                  </button>
                )}
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
    </>
  );

}

export default Chapters;