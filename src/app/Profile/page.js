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
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phoneno, setPhoneno] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          // Fetch user data from Firestore
          const email = user.email;
          const name = user.displayName;
          const phoneno = user.phoneNumber;
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          setEmail(email);
          setName(name);
          setPhoneno(phoneno);
    
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
    <div className="container p-4 mx-auto bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold text-black">Your Profile</h1>

      {userData && (
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {name || userData.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Phone Number:</span> {phoneno || userData.phoneNo}
          </p>
        </div>
      )}

      {/* <h2 className="mt-4 mb-2 text-2xl font-bold text-black">Quiz Statistics</h2>
      <p className="text-lg">
        <span className="font-semibold">Average Score:</span> {averageScore.toFixed(2)}
      </p>
      <p className="text-lg">
        <span className="font-semibold">Quizzes Attempted:</span> {quizzesAttempted}
      </p> */}

      <h2 className="mt-4 mb-2 text-2xl font-bold text-black">Reading Streak</h2>
      <table className="table-auto w-full bg-white rounded shadow">
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
