"use client"
import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

function JoinCommunity({}) {
  const [communityId, setCommunityId] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isCommunityLeader, setIsCommunityLeader] = useState(false);
  const currentUser = auth.currentUser;

  const handleJoinCommunity = async () => {
    try {
      if (!currentUser) {
        console.error('No user signed in.');
        return;
      }

      // Check if community ID exists
      const communityRef = collection(db, 'communityIds');
      const q = query(communityRef, where('communityId', '==', parseInt(communityId)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('Community ID does not exist.');
        return;
      }

      // Check if user has already sent a request for this community
      const requestQuery = query(
        collection(db, 'communityRequests'),
        where('requesterId', '==', currentUser.uid),
        where('communityId', '==', parseInt(communityId))
      );
      const requestSnapshot = await getDocs(requestQuery);

      if (!requestSnapshot.empty) {
        console.log('Request already sent for this community.');
        alert('Request already sent for this community.');
        return;
      }

      // Check if user is the leader of the community
      const communityDoc = querySnapshot.docs[0];
      const ownerUserId = communityDoc.data().userId;

      if (ownerUserId === currentUser.uid) {
        alert('You are the community leader. You cannot join your own community.');
        return;
      }

      // Send request to community owner
      const request = {
        requesterId: currentUser.uid,
        communityId: parseInt(communityId),
        status: 'pending'
      };

      await addDoc(collection(db, 'communityRequests'), request);
      setRequestSent(true);

      alert('Request sent to community owner.');
    } catch (error) {
      console.error('Error joining community:', error);
      // Handle error here
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-5 mb-5 text-center border-2 md:p-8 ">
      <h1 className="p-5 text-lg font-semibold md:text-2xl">Join Community</h1>
      <input
        type="text"
        value={communityId}
        onChange={(e) => {
          console.log(e.target.value); // Check if communityId is correctly set
          setCommunityId(e.target.value);
        }}
        placeholder="Enter Community ID"
        className="w-full px-4 py-2 mb-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />

      <button
        onClick={handleJoinCommunity}
        disabled={!communityId || requestSent}
        className={`w-full px-4 py-2 text-white bg-orange-400 rounded-md shadow-md hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 ${
          requestSent ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {requestSent ? 'Request Sent' : 'Join Community'}
      </button>
    </div>
  );
}

export default JoinCommunity;

