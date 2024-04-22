import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase/config';
import { collection, doc, getDoc } from "firebase/firestore";

const ScrollDataTable = () => {
  const [scrollData, setScrollData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [pageDataAvailable, setPageDataAvailable] = useState([]);

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
          const dataArray = Object.entries(data).map(([key, value]) => ({
            verse: key,
            scrollDepth: value.scrollDepth,
            timeSpent: value.timeSpent,
            timestamp: new Date(value.timestamp.toDate()).toLocaleString(),
          })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          // Set total pages
          setTotalPages(Math.ceil(dataArray.length / itemsPerPage));

          // Set page data availability
          const dataAvailability = Array.from({ length: totalPages }, (_, index) => {
            const startIndex = index * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return dataArray.slice(startIndex, endIndex).length > 0;
          });
          setPageDataAvailable(dataAvailability);

          // Set current page data
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
  }, [currentPage, totalPages]);

  // Estimated times for each verse (in minutes)
  const verseEstimatedTimes = {
    
      "1.1": 4, "1.2": 2, "1.3": 2, "1.4": 0, "1.5": 1, "1.6": 1, "1.7": 1, "1.8": 2, "1.9": 2, "1.10": 3, "1.11": 2, "1.12": 1, "1.13": 2, "1.14": 2, "1.15": 4, "1.16-18": 5, "1.19": 2, "1.20": 3, "1.21-22": 4, "1.23": 2, "1.24": 2, "1.25": 2, "1.26": 2, "1.27": 1, "1.28": 4, "1.29": 2, "1.30": 3, "1.31": 3, "1.32-35": 4, "1.36": 4, "1.37-38": 1, "1.39": 3, "1.40": 4, "1.41": 3, "1.42": 2,
      "2.1": 0.30, "2.2": 0, "2.3": 0, "2.4": 0, "2.5": 0, "2.6": 0, "2.7": 0, "2.8": 0, "2.9": 0, "2.10": 0, "2.11": 0, "2.12": 0, "2.13": 0, "2.14": 0, "2.15": 0, "2.16": 0, "2.17": 0, "2.18": 0, "2.19": 0, "2.20": 0, "2.21": 0, "2.22": 0, "2.23": 0, "2.24": 0, "2.25": 0, "2.26": 0, "2.27": 0, "2.28": 0, "2.29": 0, "2.30": 0, "2.31": 0, "2.32": 0, "2.33": 0, "2.34": 0, "2.35": 0, "2.36": 0, "2.37": 0, "2.38": 0, "2.39": 0, "2.40": 0, "2.41": 4, "2.42-43": 4, "2.44": 1, "2.45": 4, "2.46": 6, "2.47": 4, "2.48": 3, "2.49": 3, "2.50": 2, "2.51": 2, "2.52": 3, "2.53": 2, "2.54": 2, "2.55": 2, "2.56": 4, "2.57": 2, "2.58": 3, "2.59": 2, "2.60": 3, "2.61": 4, "2.62": 3, "2.63": 3, "2.64": 3, "2.65": 1, "2.66": 3, "2.67": 1, "2.68": 1, "2.69": 2, "2.70": 3, "2.71": 3, "2.72": 3
      // Add more key-value pairs as needed...
    };

  const handlePageClick = (pageNumber) => {
    if (pageDataAvailable[pageNumber - 1]) {
      setCurrentPage(pageNumber);
    }
  };

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
                {data.scrollDepth > 80 && data.timeSpent >= verseEstimatedTimes[data.verse] ? (
                  <span className="inline-block h-4 w-4 rounded-full bg-green-500"></span>
                ) : (
                  <span className="inline-block h-4 w-4 rounded-full bg-yellow-500"></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            disabled={!pageDataAvailable[index]}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? 'bg-gray-400 text-white'
                : pageDataAvailable[index]
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
                  : 'bg-red-200 text-red-600 cursor-not-allowed'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScrollDataTable;
