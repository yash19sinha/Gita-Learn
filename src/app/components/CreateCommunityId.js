"use client"
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, onSnapshot, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

function CreateCommunityIdForm({ onCreate, verseId }) {
  const [generatedCommunityId, setGeneratedCommunityId] = useState('');
  const [communityIds, setCommunityIds] = useState([]);
  const [requestSent, setRequestSent] = useState(false); // Track if request has been sent
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchCommunityIds = async () => {
      try {
        if (!currentUser) return;

        const communityIdsRef = collection(db, 'communityIds');
        const q = query(communityIdsRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map(doc => doc.data().communityId);
        setCommunityIds(ids);
      } catch (error) {
        console.error('Error fetching community IDs:', error);
        // Handle error here
      }
    };

    fetchCommunityIds();
  }, [currentUser, requestSent]); // Add requestSent to dependencies array

  const handleApprovedRequest = async () => {
    try {
      // Generate new community ID
      const newCommunityId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit ID

      // Add new community ID to communityIds collection
      const communityData = {
        communityId: newCommunityId,
        userId: currentUser.uid
      };
      await addDoc(collection(db, 'communityIds'), communityData);

      // Update the UI with the new community ID
      setGeneratedCommunityId(newCommunityId);
    } catch (error) {
      console.error('Error handling approved request:', error);
      // Handle error here
    }
  };

  const handleCreateCommunityId = async () => {
    try {
      if (!currentUser) {
        console.error('No user signed in.');
        return;
      }
  
      // Check if user already has community IDs
      const communityIdsRef = collection(db, 'communityIds');
      const q = query(communityIdsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
  
      // If user already has community IDs, do nothing
      if (!querySnapshot.empty) {
        console.log('User already has community IDs.');
        return;
      }
  
      // Generate new community ID
      const newCommunityId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit ID
  
      // Add new community ID to communityIds collection
      const communityData = {
        communityId: newCommunityId,
        userId: currentUser.uid
      };
      await addDoc(collection(db, 'communityIds'), communityData);
  
      // Update the UI with the new community ID
      setGeneratedCommunityId(newCommunityId);
      setCommunityIds([newCommunityId]);
  
      alert('Your first community ID has been created.');
    } catch (error) {
      console.error('Error creating community ID:', error);
      // Handle error here
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="mb-5">
        {!requestSent && (
          <button onClick={handleCreateCommunityId} className="w-full px-4 py-2 text-white bg-orange-400 rounded-md shadow-md hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300">
            Get Your Community ID
          </button>
        )}
        {generatedCommunityId && (
          <p className="mt-2 text-lg">Generated Community ID: {generatedCommunityId}</p>
        )}
      </div>
      <div>
        <h2 className="mb-2 text-xl font-semibold">Your Community IDs:</h2>
        <ul className="pl-6 list-disc">
          {communityIds.map(id => (
            <li key={id} className="mb-1">{id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreateCommunityIdForm;




