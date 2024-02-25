// components/ScrollDepth.js
import { useEffect, useRef } from 'react';

const ScrollDepth = ({ chapter, verse }) => {
  const startTime = useRef(new Date().getTime());
  const lastScrollY = useRef(0);

  const logScrollDepth = () => {
    const currentTime = new Date().getTime();
    const timeSpentInSeconds = (currentTime - startTime.current) / 1000;
    const timeSpentInMinutes = timeSpentInSeconds / 60; // Convert to minutes

    const verseElement = document.getElementById(`chapter${chapter}-verse${verse}`);
    if (!verseElement) return;

    const scrollHeight = verseElement.scrollHeight;
    const scrollTop = window.scrollY;
    const verseTopOffset = verseElement.offsetTop;
    const windowHeight = window.innerHeight;

    // Calculate scroll depth within the verse
    const verseScrollDepth = ((scrollTop - verseTopOffset) / (scrollHeight - windowHeight)) * 100;

    // Check if scrolling down and scroll depth is less than 100
    if (scrollTop > lastScrollY.current && verseScrollDepth < 100) {
      console.log(`Chapter ${chapter}, Verse ${verse} Scroll Depth: ${verseScrollDepth.toFixed(2)}%, Time Spent: ${timeSpentInMinutes.toFixed(2)} minutes`);
    } else if (verseScrollDepth >= 100) {
      console.log(`Chapter ${chapter}, Verse ${verse} Scroll Depth reached 100%. Stopping the timer.`);
      window.removeEventListener('scroll', logScrollDepth);
    }

    lastScrollY.current = scrollTop;
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener('scroll', logScrollDepth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', logScrollDepth);
    };
  }, [chapter, verse]);

  return null;
};

export default ScrollDepth;
