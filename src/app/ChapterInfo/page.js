// pages/ChapterInfo.js
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Footer } from "../components/Footer";

function ChapterInfo() {
  const searchParams = useSearchParams();
  const chapterNumber = searchParams.get("chapterNumber");
  const [chapters, setChapters] = useState([]);

  const [verses, setVerses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://gita-learn-api.vercel.app/api/chapters"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChapters(data.chapters);
      } catch (error) {
        console.error("Error fetching chapters with descriptions:", error);
        // Handle error here
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchVerses() {
      try {
        const response = await fetch(
          `https://gita-learn-api.vercel.app/api/verses/${chapterNumber}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Chapter Number:", chapterNumber);
        console.log("Verses Data:", data.verses);
        setVerses(data.verses);
      } catch (error) {
        console.error("Error fetching verses:", error);
        // Handle error here
      }
    }
    if (chapterNumber) {
      fetchVerses();
    } else {
      console.log("not working");
    }
  }, [chapterNumber]);

  // Find the selected chapter using chapterNumber
  const selectedChapter = chapters.find(
    (chapter) => chapter.chapter_number === parseInt(chapterNumber)
  );

  return (
    <>
      <div className="min-h-screen p-4 mt-4">
        <h1 className="flex justify-center mb-4 text-2xl font-semibold">
          Chapter {chapterNumber}
        </h1>

        {selectedChapter ? (
          <div className="flex justify-center w-full mb-4 ">
            <h2 className="flex justify-center p-1 text-3xl font-semibold sm:text-4xl">
              {selectedChapter.name}
            </h2>
          </div>
        ) : (
          <div className="flex items-center justify-center">
          <span className="text-2xl  loading loading-dots loading-lg"></span>
          </div>
        )}

        <div className="items-center justify-center overflow-x-auto md:m-10">
          {verses.map((verse) => (
            <p
              key={verse.verse_number}
              className="p-4 text-xl font-normal text-justify sm:mx-20 sm:px-16 hover:bg-gray-100 dark-theme"
            >
              <Link
                href={`/VerseDetail?chapterVerse=${chapterNumber}.${verse.verse_number}`}
              >
                {verse.text}
              </Link>
            </p>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChapterInfo;
