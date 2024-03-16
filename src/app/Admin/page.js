// AdminPage.js
"use client"
import { useState, useEffect } from 'react';
import { collection, getFirestore, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/AdminLogin');
          return;
        }
        
        // Check if the user has the admin role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          router.push('/');
          return;
        }

        const requestsRef = collection(db, 'communityIdRequests');
        const q = query(requestsRef, where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const requestData = await Promise.all(querySnapshot.docs.map(async doc => {
          const data = doc.data();
          const displayName = await getUsername(data.userId);
          return { id: doc.id, displayName, ...data };
        }));
        setRequests(requestData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
  
    fetchRequests();
  }, []);

  const approveRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, 'communityIdRequests', requestId), { status: 'approved' });
      setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const getUsername = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId)); // Assuming 'users' is the collection storing user information
      if (userDoc.exists()) {
        return userDoc.data().displayName;
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
    return ''; // Return an empty string if username retrieval fails
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h1 className="mb-5 text-2xl font-semibold">Community ID Requests</h1>
      <table className="border border-collapse border-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-400">User ID</th>
            <th className="px-4 py-2 border border-gray-400">User Name</th>
            <th className="px-4 py-2 border border-gray-400">Status</th>
            <th className="px-4 py-2 border border-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td className="px-4 py-2 border border-gray-400">{request.userId}</td>
              <td className="px-4 py-2 border border-gray-400">{request.displayName}</td>
              <td className="px-4 py-2 border border-gray-400">{request.status}</td>
              <td className="px-4 py-2 border border-gray-400">
                <button onClick={() => approveRequest(request.id)} className="px-3 py-1 mt-2 text-white bg-green-500 rounded-md">Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
