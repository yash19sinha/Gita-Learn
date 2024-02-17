// pages/Profile.js
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth';
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [averageScore, setAverageScore] = useState(0);
  const [quizzesAttempted, setQuizzesAttempted] = useState(0);
  const [timersData, setTimersData] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [newPhoneNo, setNewPhoneNo] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const email = user.email;
          const name = user.displayName;

          setEmail(email);
          setName(name);

          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            setUserData(userDataFromFirestore);

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

            if (userDataFromFirestore.timers) {
              const timersArray = userDataFromFirestore.timers.map((timerData) => ({
                timer: (timerData.timer / 60).toFixed(2),
                timestamp: timerData.timestamp.toDate(),
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

  const updatePhoneNumber = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);

      // Update phone number in the Firestore document
      await updateDoc(userDocRef, { phoneNo: newPhoneNo });

      // Update phone number in the local state
      setPhoneno(newPhoneNo);

      // Exit edit mode
      setIsEditing(false);

      console.log('Phone number updated successfully.');
    } catch (error) {
      console.error('Error updating phone number:', error);
    }
  };

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
          <div className="flex items-center">
            <p className="text-lg">
              <span className="font-semibold">Phone Number:</span>
              {isEditing ? (
                <input
                  type="text"
                  className="border ml-2 p-1"
                  value={newPhoneNo}
                  onChange={(e) => setNewPhoneNo(e.target.value)}
                />
              ) : (
                <span className="ml-2">{phoneno || userData.phoneNo}</span>
              )}
            </p>
            {isEditing ? (
              <button
                className="ml-2 bg-green-500 text-white p-1 rounded"
                onClick={updatePhoneNumber}
              >
                Save
              </button>
            ) : (
              <button
                className="ml-2 bg-blue-500 text-white p-1 rounded"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      )}

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
              <td className="border px-4 py-2">{timer.timer} Minutes</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Profile;
