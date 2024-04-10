import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, doc, getDoc } from "firebase/firestore";

const ScrollDataTable = () => {
  const [scrollData, setScrollData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userId = user.uid;

      try {
        const userRef = doc(db, 'users', userId);
        const scrollDataRef = doc(collection(userRef, 'scrollData'), 'data');
        const scrollDataSnapshot = await getDoc(scrollDataRef);
        const data = scrollDataSnapshot.data();

        if (data) {
          const formattedData = Object.entries(data).map(([key, value]) => ({
            verse: key,
            scrollDepth: value.scrollDepth,
            timeSpent: value.timeSpent,
            timestamp: new Date(value.timestamp.toDate()).toLocaleString()
          }));
          setScrollData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching scroll data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
    <h2 className="mb-4 text-lg font-bold">Scroll Data</h2>
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left bg-gray-200">Verse</th>
          <th className="px-4 py-2 text-left bg-gray-200">Scroll Depth (%)</th>
          <th className="px-4 py-2 text-left bg-gray-200">Time Spent (minutes)</th>
          <th className="px-4 py-2 text-left bg-gray-200">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {scrollData.map((data) => (
          <tr key={data.verse}>
            <td className="px-4 py-2 border">{data.verse}</td>
            <td className="px-4 py-2 border">{data.scrollDepth}</td>
            <td className="px-4 py-2 border">{data.timeSpent}</td>
            <td className="px-4 py-2 border">{data.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
};

export default ScrollDataTable;
