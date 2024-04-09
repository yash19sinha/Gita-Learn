import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, doc, getDoc } from "firebase/firestore";

const ScrollDataTable = () => {
  const [scrollData, setScrollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

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
          // Convert object into array and sort by timestamp in descending order
          const dataArray = Object.entries(data).map(([key, value]) => ({
            verse: key,
            scrollDepth: value.scrollDepth,
            timeSpent: value.timeSpent,
            timestamp: new Date(value.timestamp.toDate()).toLocaleString()
          })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          // Set total pages based on available data
          setTotalPages(Math.ceil(dataArray.length / itemsPerPage));

          // Select the data for the current page
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const latestData = dataArray.slice(startIndex, endIndex);

          setScrollData(latestData);
        }
      } catch (error) {
        console.error('Error fetching scroll data:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="mb-4 text-lg font-bold">Track Your Progress</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left bg-gray-200">Verse</th>
            <th className="px-4 py-2 text-left bg-gray-200">Scroll Depth (%)</th>
            <th className="px-4 py-2 text-left bg-gray-200">Time Spent (minutes)</th> 
            <th className="px-4 py-2 text-left bg-gray-200">Timestamp</th>
            <th className="px-4 py-2 text-left bg-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {scrollData.map((data) => (
            <tr key={data.verse}>
              <td className="px-4 py-2 border">{data.verse}</td>
              <td className="px-4 py-2 border">{data.scrollDepth}</td>
              <td className="px-4 py-2 border">{data.timeSpent}</td> 
              <td className="px-4 py-2 border">{data.timestamp}</td>
              <td className="px-4 py-2 border">
                {data.scrollDepth > 80 && data.timeSpent >= 5 ? (
                  <span className="inline-block h-4 w-4 rounded-full bg-green-500"></span>
                ) : (
                  <span className="inline-block h-4 w-4 rounded-full bg-yellow-500"></span>
                )}
              </td> 
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageClick(index + 1)} disabled={index + 1 > totalPages} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-green-600 text-white'}`}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScrollDataTable;
