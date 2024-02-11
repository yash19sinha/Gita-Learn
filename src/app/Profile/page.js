// pages/Profile.js
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth';
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [averageScore, setAverageScore] = useState(0);
  const [quizzesAttempted, setQuizzesAttempted] = useState(0);
  const [timersData, setTimersData] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
    
          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            setUserData(userDataFromFirestore);
    
            // Fetch user's scores for calculating average score and number of quizzes attempted
            const scoresRef = collection(db, 'scores');
            const userScoresQuery = query(scoresRef, where('userId', '==', user.uid));
            const userScoresSnapshot = await getDocs(userScoresQuery);
    
            let totalScore = 0;
            let quizzesCount = 0;
    
            userScoresSnapshot.forEach((scoreDoc) => {
              const scoreData = scoreDoc.data();
              totalScore += scoreData.score;
              quizzesCount += 1;
            });
    
            const avgScore = quizzesCount > 0 ? totalScore / quizzesCount : 0;
            setAverageScore(avgScore);
            setQuizzesAttempted(quizzesCount);
    
            // Fetch user's timers data
            if (userDataFromFirestore.timers) {
              // Assuming 'timers' field exists in the user document
              const timersArray = userDataFromFirestore.timers.map(timerData => ({
                timer: timerData.timer,
                timestamp: timerData.timestamp.toDate()
              }));
    
              setTimersData(timersArray);
            } else {
              console.error('Timers data not found in user document.');
            }
          } else {
            console.error('User document not found in Firestore.');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Your Profile</h1>

      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p>Name: {userData.name}</p>
          <p>Phone Number: {userData.phoneNo}</p>
        </div>
      )}

      <h2 className="mt-4 mb-2 text-2xl font-bold">Quiz Statistics</h2>
      <p>Average Score: {averageScore.toFixed(2)}</p>
      <p>Quizzes Attempted: {quizzesAttempted}</p>

      <h2 className="mt-4 mb-2 text-2xl font-bold">Reading Streak</h2>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Day and date</th>
            <th className="px-4 py-2">Timer</th>
          </tr>
        </thead>
        <tbody>
          {timersData.map((timer, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{timer.timestamp.toISOString()}</td>
              <td className="border px-4 py-2">{timer.timer} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Profile;
