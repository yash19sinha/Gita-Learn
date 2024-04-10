"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";

function ChapterInfo() {
    const searchParams = useSearchParams();
    const sectionName = searchParams.get("sectionName");

  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    if (sectionName) {
      // Function to fetch data for the selected section
      const fetchSectionData = async () => {
        try {
          const response = await fetch(`https://gita-learn-api.vercel.app/api/section/${sectionName}`);
          if (!response.ok) {
            throw new Error('Failed to fetch section data');
          }
          const data = await response.json();
          setSectionData(data.paragraphs);
        } catch (error) {
          console.error('Error fetching section data:', error);
        }
      };

      fetchSectionData();
    }
  }, [sectionName]);

  if (!sectionData) {
    return <div className="flex items-center justify-center min-h-screen">
    <span className="text-2xl loading loading-dots loading-lg"></span>
    </div>
  }

  return (
    <div className="min-h-screen p-4 mt-4">
        <h1 className="flex justify-center mb-4 text-3xl font-semibold">
          {sectionName}
        </h1>
    <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 "style={{whiteSpace: 'pre-line'}}>
    <ul>
        {sectionData.map((paragraph, index) => (
          <li className="flex justify-center p-3 text-lg " key={index}>{paragraph}</li>
        ))}
      </ul>
        
    </div>
      
    </div>
  );
}

export default ChapterInfo;
