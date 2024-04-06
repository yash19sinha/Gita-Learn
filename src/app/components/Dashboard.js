"use client"
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

function Dashboard() {
  const [requests, setRequests] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!currentUser) return;
    
        const communityIdsRef = collection(db, 'communityIds');
        const communityIdsQuery = query(communityIdsRef, where('userId', '==', currentUser.uid));
        const communityIdsSnapshot = await getDocs(communityIdsQuery);
        const communityIds = communityIdsSnapshot.docs.map(doc => doc.data());
    
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
    
    
    


    fetchRequests();
  }, [currentUser]);

  const approveRequest = async (requestId, communityId, communityName) => {
    console.log("Community ID:", communityId); // Check communityId value
    try {
        // Check if requestId, communityId, or communityName is undefined
        if (!requestId || !communityId || !communityName) {
            console.error("Request ID, Community ID, or Community Name is undefined.");
            return;
        }

        // Update the status of the request to 'approved' in the 'communityRequests' collection
        await updateDoc(doc(db, 'communityRequests', requestId), { status: 'approved' });

        // Retrieve the requesterId associated with the requestId
        const requestDoc = await getDoc(doc(db, 'communityRequests', requestId));
        const requesterId = requestDoc.data().requesterId;

        // Store the approved community ID and name in the 'YourIds' collection specific to the requester's user ID
        const requesterYourIdsRef = doc(db, 'YourIds', requesterId);
        const requesterDocSnapshot = await getDoc(requesterYourIdsRef);

        // Check if requester document exists
        if (requesterDocSnapshot.exists()) {
            const requesterYourIds = requesterDocSnapshot.data().yourIds || [];
            // Update requester document with the new approved community ID and name
            await updateDoc(requesterYourIdsRef, { yourIds: [...requesterYourIds, { communityId, communityName }] });
        } else {
            // Create a new requester document with the approved community ID and name
            await setDoc(requesterYourIdsRef, { yourIds: [{ communityId, communityName }] });
        }

        // Optional: Remove the approved request from the state
        setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
        console.error('Error approving request:', error);
        // Handle error here
    }
};


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
  
  
  

  return (
    <div className="py-10 ">
      <h2 className="mb-4 font-semibold md:text-xl text:sm">Requests to Join Your Communities:</h2>
      <div className="">
        <table className="w-full my-4 text-xs bg-white rounded shadow table-auto md:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-1 md:py-2 md:px-3">Community Name</th>
              <th className="p-1md:py-2 md:px-3">User Name</th>
              <th className="p-1 md:py-2 md:px-3">Status</th>
              <th className="p-1 md:py-2 md:px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
          {requests.map((request) => (
        <tr key={request.id}>
          <td className="p-1 border md:py-2 md:px-3">{request.communityName}</td>
          <td className="p-1 border md:py-2 md:px-3">{request.userName}</td>
          <td className="p-1 border md:py-2 md:px-3">{request.status}</td>
          <td className="p-1 border md:py-2 md:px-3">
            {request.status === 'pending' && (
             <button onClick={() => {
              console.log("Request ID:", request.id);
              console.log("Community ID:", request.communityId);
              console.log("Community Name:", request.communityName); 
              approveRequest(request.id, request.communityId, request.communityName);
          }} className="px-3 py-1 mt-2 text-white bg-green-500 rounded-md">Approve</button>
          
            )}
          </td>
        </tr>
      ))}


          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { collection, query, where, getDocs, onSnapshot, doc, updateDoc,getDoc } from 'firebase/firestore';
// import { db, auth } from '../firebase/config';

// function Dashboard() {
//   const [requests, setRequests] = useState([]);
//   const currentUser = auth.currentUser;

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         if (!currentUser) return;

//         // Fetch community IDs owned by the current user
//         const communityIdsRef = collection(db, 'communityIds');
//         const communityIdsQuery = query(communityIdsRef, where('userId', '==', currentUser.uid));
//         const communityIdsSnapshot = await getDocs(communityIdsQuery);
//         const communityIds = communityIdsSnapshot.docs.map(doc => doc.data().communityId);

//         // Fetch requests for those community IDs
//         const requestsRef = collection(db, 'communityRequests');
//         const requestsQuery = query(requestsRef, where('communityId', 'in', communityIds));
//         const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
//           const requestData = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data()
//           }));
//           setRequests(requestData);
//         });

//         return () => unsubscribe();
//       } catch (error) {
//         console.error('Error fetching requests:', error);
//         // Handle error here
//       }
//     };

//     fetchRequests();
//   }, [currentUser]);

  // const approveRequest = async (requestId, communityId) => {
  //   console.log(communityId)
  //   try {
  //     // Update the status of the request to 'approved' in the 'communityRequests' collection
  //     await updateDoc(doc(db, 'communityRequests', requestId), { status: 'approved' });
  
  //     // Store the approved community ID in the 'YourIds' collection specific to the user ID
  //     const userId = auth.currentUser.uid;
  //     const yourIdsRef = collection(db, 'YourIds');
  //     const userDoc = doc(yourIdsRef, userId);
  //     const userDocSnapshot = await getDoc(userDoc);
  
  //     // If the user document exists, update it with the new approved community ID
  //     if (userDocSnapshot.exists()) {
  //       const userYourIds = userDocSnapshot.data().yourIds || [];
  //       await updateDoc(userDoc, { yourIds: [...userYourIds, communityId] });
  //     } else {
  //       // If the user document doesn't exist, create a new one with the approved community ID
  //       await setDoc(userDoc, { yourIds: [communityId] });
  //     }
  
  //     // Optional: Remove the approved request from the state
  //     setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
  //   } catch (error) {
  //     console.error('Error approving request:', error);
  //     // Handle error here
  //   }
  // };
  
  

//   return (
//     <div className="p-5">
//       <h2 className="mb-4 text-xl font-semibold">Requests to Join Your Communities:</h2>
//       <table className="w-full border-black ">
//         <thead>
//           <tr className="border">
//             <th className="px-4 py-2">Requester ID</th>
//             <th className="px-4 py-2">Community ID</th>
//             <th className="px-4 py-2">Status</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map((request) => (
//             <tr key={request.id}>
//               <td className="px-4 py-2 border">{request.requesterId}</td>
//               <td className="px-4 py-2 border">{request.communityId}</td>
//               <td className="px-4 py-2 border">{request.status}</td>
//               <td className="px-4 py-2 border">
//                 {request.status === 'pending' && (
//                   <button onClick={() => approveRequest(request.id)} className="px-3 py-1 mt-2 text-white bg-green-500 rounded-md">Approve</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Dashboard;


