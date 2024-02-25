// CreateCommunityIdForm.js
"use client"
import { useState } from 'react';
import { addDoc, collection, getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import { db } from '../firebase/config';

function CreateCommunityIdForm({ onCreate, verseId }) {
  const [generatedCommunityId, setGeneratedCommunityId] = useState('');
  const [isCreatingCommunityId, setIsCreatingCommunityId] = useState(false);

  const handleCreateCommunityId = async () => {
    try {
      const communityIdRef = doc(collection(getFirestore(), 'communityIds'));
      const communityIdSnapshot = await getDoc(communityIdRef);
  
      if (communityIdSnapshot.exists()) {
        alert('Community ID already exists. Try entering the existing ID.');
      } else {
        const newCommunityId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit ID
        setGeneratedCommunityId(newCommunityId);
  
        setIsCreatingCommunityId(true);
  
        const communityData = {
          communityId: newCommunityId,
        };
  
        await addDoc(collection(getFirestore(), 'communityIds'), communityData);
  
        console.log('Community ID created:', communityData);
      }
    } catch (error) {
      console.error('Error creating community ID:', error);
      // Handle error here
    }
  };

  return (
    <div className="flex p-5">
 
        <div className="flex flex-col items-center justify-center">
          <button onClick={handleCreateCommunityId} className="w-full text-white bg-orange-400 btn">
            Create a Community ID
          </button>
          {generatedCommunityId && (
            <p className="mt-2">Generated Community ID: {generatedCommunityId}</p>
          )}
        </div>
      </div>

  );
}

export default CreateCommunityIdForm;
