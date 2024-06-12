"use client"
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc , setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import JoinCommunity from './JoinCommunity';
import Dashboard from './Dashboard';
import { FaRegClipboard } from "react-icons/fa6";

function CreateCommunityIdForm() {
  const [generatedCommunityId, setGeneratedCommunityId] = useState('');
  const [communityName, setCommunityName] = useState('');
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

  const handleCreateCommunityId = async () => {
    try {
        if (!currentUser) {
            console.error('No user signed in.');
            return;
        }

        // Check if user already has community IDs
        if (communityIds.length > 0) {
            console.log('User already has community IDs.');
            alert('User already has community IDs.')
            return;
        }

        // Check if community name is provided
        if (!communityName) {
            alert('Please enter the name of your community.');
            return;
        }

        // Generate new community ID
        const newCommunityId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit ID

        // Add new community ID to communityIds collection
        const communityData = {
            communityId: newCommunityId,
            userId: currentUser.uid,
            communityName: communityName
        };
        await addDoc(collection(db, 'communityIds'), communityData);

        // Update the UI with the new community ID
        setGeneratedCommunityId(newCommunityId);
        setCommunityIds([newCommunityId]);

        // Store the community ID and community name in the YourIds collection
        const yourIdsRef = collection(db, 'YourIds');
        await setDoc(doc(yourIdsRef, currentUser.uid), { yourIds: [{ communityId: newCommunityId, communityName }] });

        alert('Your community ID has been created and stored.');
    } catch (error) {
        console.error('Error creating community ID:', error);
        // Handle error here
    }
};

const copyIdToClipboard = (id) => {
  navigator.clipboard.writeText(id)
    .then(() => {
      console.log('Community ID copied to clipboard:', id);
      // You can add further feedback to the user here if needed
    })
    .catch((error) => {
      console.error('Error copying community ID to clipboard:', error);
    });
};

  

  return (
    <div className="flex flex-col items-center justify-center ">
      
      <div className="w-full p-5 mb-5 text-center border-2 md:p-8">
      <h2 className='p-5 text-lg font-semibold md:text-2xl'>Create your own community id</h2>
        {!requestSent && (
          <div>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter the name of your community"
              className="w-4/5 px-4 py-2 mb-2 text-sm text-center border rounded-md focus:outline-none focus:ring focus:ring-gray-300 md:text-base"
            />
            <button onClick={handleCreateCommunityId} className="w-4/5 px-4 py-2 text-sm text-white bg-orange-400 rounded-md shadow-md hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 md:text-base">
              Get Your Community ID
            </button>
          </div>
        )}
        {generatedCommunityId && (
          <p className="mt-2 text-lg">Generated Community ID: {generatedCommunityId}</p>
        )}

      <div>
          <h2 className="p-2 m-2 text-xl font-semibold">Your Community IDs:</h2>
          <ul className="flex flex-wrap justify-center p-3">
        {communityIds.map((id) => (
          <li key={id} className="flex items-center mb-2 mr-2">
            <label
              className="px-2 py-1 text-lg text-center rounded-l w-44 bg-slate-200"
              htmlFor={`copyBtn${id}`}
            >
              {id}
            </label>
            <button
              id={`copyBtn${id}`}
              onClick={() => copyIdToClipboard(id)}
              className="px-2 py-1 text-white transition duration-300 ease-in-out bg-blue-500 rounded-r hover:bg-blue-600"
            >
              <FaRegClipboard className='m-1 text-xl'/>
            </button>
          </li>
        ))}
      </ul>
        </div>
      </div>
      
      <JoinCommunity/>
    
      <Dashboard/>
    
     
    </div>
  );
}

export default CreateCommunityIdForm;





