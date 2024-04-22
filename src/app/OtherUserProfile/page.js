// pages/OtherUserProfile.js
"use client";
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import 'react-calendar/dist/Calendar.css';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import OtherScrollTable from '../components/OtherScrollTable';
import { useSearchParams } from 'next/navigation';

function OtherUserProfile() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [userData, setUserData] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const imgUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userDataFromFirestore = userDocSnapshot.data();
          
          // Set user data
          setUserData(userDataFromFirestore);
  
          // Set image URL
          if (userDataFromFirestore.photoURL) {
            setImageURL(userDataFromFirestore.photoURL);
          } else {
            setImageURL(imgUrl);
          }
  
          // Manage displayName and name
          let displayName = userDataFromFirestore.name|| userDataFromFirestore.name  || 'Unknown User';
          console.log('User Data:', userDataFromFirestore); // Log the user data
          console.log('DisplayName:', displayName);
          console.log('Email:', userDataFromFirestore.email);
          console.log('Photo:', userDataFromFirestore.photoURL);
        } else {
          console.error('User document not found in Firestore.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  

  return (
    <div className="container min-h-screen p-4 mx-auto mt-4">
      {/* Display user profile information */}
      <div className="flex flex-col items-center md:flex-row">
        <div className="p-4 mb-4 rounded shadow md:mr-4 md:mb-0">
          <img
            src={imageURL}
            alt="User Profile"
            className="w-56 h-56 mx-auto mb-2 rounded-full md:mr-4"
          />
          {userData && (
            <h1 className="text-3xl font-bold text-center text-black">{userData.displayName || userData.name}</h1>
          )}
        </div>

        {userData && (
          <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-md md:w-4/5 h-72">
            <div className="mb-2">
              <span className="text-xl font-semibold">Name: {userData.displayName || userData.name }</span>
            </div>
            <div className="mb-2">
              <span className="text-xl font-semibold">PhoneNumber: {userData.phoneNo}</span>
            </div>
            {/* Display other user profile details as needed */}
          </div>
        )}
      </div>

      {userId && <OtherScrollTable userId={userId} />}

  
    </div>
  );
}

export default OtherUserProfile;
