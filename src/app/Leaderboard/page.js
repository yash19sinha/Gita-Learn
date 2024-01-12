// pages/Leaderboard.js
"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { app, auth, db } from '../firebase/config';

function Leaderboard() {
  const searchParams = useSearchParams();
  const verseId = searchParams.get('verseId');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        if (!verseId) {
          setError('Verse ID is not provided.');
          return;
        }
  
        const scoresRef = collection(db, `scores/${verseId}/userScores`);
        const scoresQuery = query(scoresRef, orderBy('score', 'desc'), limit(10));
        const snapshot = await getDocs(scoresQuery); // Declare snapshot here
  
        const leaderboardData = [];
  
        for (const docSnapshot of snapshot.docs) {
          const userData = docSnapshot.data();
          const userId = docSnapshot.id;
  
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
  
          if (userDoc.exists()) {
            const authMethod = userDoc.data().authMethod;
            let displayName;
  
            if (authMethod === 'google') {
              // For Google-authenticated users, use the display name
              displayName = userDoc.data().displayName || 'Google User';
            } else {
              // For other authentication methods, use the name stored in Firestore
              displayName = userDoc.data().name || 'Unknown User';
            }
  
            leaderboardData.push({
              userId,
              username: displayName,
              ...userData,
            });
          } else {
            // Handle the case when the user document does not exist
            console.error(`User document not found for user ID: ${userId}`);
          }
        }
  
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to fetch leaderboard. Please try again. Error: ' + error.message);
      } finally {
        setLoading(false);
      }
    }

    if (verseId) {
      fetchLeaderboard();
    }
  }, [verseId]);
  
    
  

  return (
    <div className='h-screen bg-white'>
    <div className="container p-8 mx-auto my-8 bg-gray-100">
    {loading ? (
      <p className="text-xl font-semibold text-center">Loading...</p>
    ) : error ? (
      <p className="text-center text-red-500">{error}</p>
    ) : (
      <div>
        <h1 className="mb-4 text-2xl font-bold md:text-3xl">Leaderboard for Verse: {verseId}</h1>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((entry) => (
              <tr key={entry.userId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{entry.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{entry.score}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  </div>
  );
}

export default Leaderboard;
