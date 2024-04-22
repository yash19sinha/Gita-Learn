"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import Link from "next/link"

function Dashboard() {
  const currentUser = auth.currentUser;
  const [requests, setRequests] = useState([]);
  const [communityMembers, setCommunityMembers] = useState([]);
  
  const [imageURL, setImageURL] = useState(null);
  const imgUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  
 

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!currentUser) return;

        const communityIdsRef = collection(db, 'communityIds');
        const communityIdsQuery = query(communityIdsRef, where('userId', '==', currentUser.uid));
        const communityIdsSnapshot = await getDocs(communityIdsQuery);
        const communityIds = communityIdsSnapshot.docs.map(doc => doc.data());
        if (communityIds.length === 0) {
          console.error('Community IDs array is empty.');
          return;
        }

        const requestsRef = collection(db, 'communityRequests');
        const requestsQuery = query(requestsRef, where('communityId', 'in', communityIds.map(community => community.communityId)));
        const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
          const requestData = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const userName = await getUsername(data.requesterId);
            const community = communityIds.find(community => community.communityId === data.communityId);
            const communityName = community ? community.communityName : 'Unknown'; // Use ternary operator to handle undefined
            return {
              id: doc.id,
              communityName,
              userName,
              status: data.status,
              communityId: data.communityId
            };
          });
          Promise.all(requestData).then(setRequests);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching requests:', error);
        // Handle error here
      }
    };

    const fetchCommunityMembers = async () => {
      try {
        if (!currentUser) return;
    
        const communityIdsRef = collection(db, 'communityIds');
        const communityIdsQuery = query(communityIdsRef, where('userId', '==', currentUser.uid));
        const communityIdsSnapshot = await getDocs(communityIdsQuery);
        const communityIds = communityIdsSnapshot.docs.map(doc => doc.data());
        if (communityIds.length === 0) {
          console.error('Community IDs array is empty.');
          return;
        }
    
        const communityMembersData = [];
        for (const community of communityIds) {
          const communityMembersRef = collection(db, `communityMembers/${community.communityId}/users`);
          const communityMembersSnapshot = await getDocs(communityMembersRef);
          const userDataPromises = communityMembersSnapshot.docs.map(async (doc) => {
            const userData = doc.data();
            const userDataWithDisplayName = await getUserData(userData.userId);
            return { userId: userData.userId, displayName: userDataWithDisplayName.displayName, photoURL: userDataWithDisplayName.photoURL, communityId: community.communityId };
          });
          

          const userDataArray = await Promise.all(userDataPromises);
          communityMembersData.push(...userDataArray);
        }
    
        setCommunityMembers(communityMembersData);
      } catch (error) {
        console.error('Error fetching community members:', error);
        // Handle error here
      }
    };
    
    

    fetchRequests();
    fetchCommunityMembers();
  }, [currentUser]);

  const getUsername = async (requesterId) => {
    try {
      console.log("Fetching username for requesterId:", requesterId); // Log requesterId for debugging
      if (!requesterId) return ''; // Return an empty string if requesterId is undefined
      const userDoc = await getDoc(doc(db, 'users', requesterId)); // Assuming 'users' is the collection storing user information
      console.log("User Doc:", userDoc.data()); // Log the entire user document for debugging
      if (userDoc.exists()) {
        let displayName = userDoc.data().displayName || userDoc.data().name || 'Unknown User';
        console.log("Final Display Name:", displayName); // Log the final display name for debugging
        return displayName;
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
    return ''; // Return an empty string if username retrieval fails
  };
  
  const getUserData = async (userId) => {
    try {
      console.log("Fetching user data for userId:", userId);
      if (!userId) return {};
    
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User Data:", userData);
        
        // Fetch photoURL of the user with the provided userId
        let photoURL = ''; // Initialize photoURL
        
        // Check if the user used Google authentication
        if (userData.authMethod === 'google') {
          // If Google authenticated, try to fetch the photoURL from user data
          if (userData.photoURL) {
            photoURL = userData.photoURL;
            console.log("Photo URL from User Data:", photoURL); // Log the photoURL from user data
          } else {
            console.log("Photo URL not found in user data."); // Log a message indicating that photoURL is not found
          }
        } else {
          console.log("User did not use Google authentication."); // Log a message indicating that the user did not use Google authentication
        }
        
        // Fetch displayName of the user with the provided userId
        let displayName = userData.displayName || userData.name || 'Unknown User'; // Use the displayName from user data, or fallback to the name field, or set it to 'Unknown User' if not available
        
        console.log("Photo URL:", photoURL); // Log the photoURL
        console.log("Display Name:", displayName); // Log the displayName
        
        return { displayName, photoURL }; // Return photoURL and displayName
      } else {
        console.log("User document not found for userId:", userId);
        return {};
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {};
    }
  };
  
  
  
  
  
  
  

  return (
    <div className="min-h-screen p-10">
      <h2 className="mb-4 text-xl font-bold ">Community Members:</h2>
      <div className="">
        <ul>
        {communityMembers.map((member, index) => (
  <li key={index} className="flex items-center py-2 space-x-4">
    {/* Log the member's photoURL */}
    {console.log("Member Photo URL:", member.photoURL)}
    {/* Display the user's profile photo */}
    {member.photoURL ? (
      <img src={member.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
    ) : (
      <img src={imgUrl} alt="Profile" className="w-10 h-10 rounded-full" />
    )}
    {/* Display the user's display name */}
    {member.displayName && <span className="text-gray-800">{member.displayName}</span>}
    {/* Redirect to the user's profile page on click */}
    <Link href={`/OtherUserProfile?userId=${member.userId}`} className="text-blue-500 hover:underline">
      View Profile
    </Link>
  </li>
))}

        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

