"use client"
import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

function RequestCommunityIdPage() {
  const [communityId, setCommunityId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e) => {
    e.preventDefault();

    // Trim whitespace from communityId
    const trimmedCommunityId = communityId.trim();

    if (!trimmedCommunityId) {
      alert('Please enter a Community ID.');
      return;
    }

    try {
      setLoading(true);

      // Check if community ID exists
      const communityIdsRef = collection(db, 'communityIds');
      const q = query(communityIdsRef, where('communityId', '==', trimmedCommunityId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Community ID does not exist.');
        return;
      }

      // Add user's request to Firestore
      const requestData = {
        userId: auth.currentUser.uid,
        communityId: trimmedCommunityId,
        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'communityIdRequests'), requestData);

      alert('Request sent. Please wait for approval.');

      // Reset form state
      setCommunityId('');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h2 className="mb-5 text-xl font-semibold">Request Community ID</h2>
      <form onSubmit={handleRequest} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter Community ID"
          value={communityId}
          onChange={(e) => setCommunityId(e.target.value)}
          className="w-full px-4 py-2 mb-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Sending Request...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
}

export default RequestCommunityIdPage;

