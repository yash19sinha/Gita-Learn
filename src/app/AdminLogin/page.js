// AdminLoginPage.js
"use client"
// AdminLoginPage.js
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/app/firebase/config';
import { getDoc, doc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user has the admin role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        // User has signed in successfully and has the admin role
        setEmail('');
        setPassword('');
        router.push('/Admin');
      } else {
        // User does not have the admin role
        window.alert('You do not have permission to access this page.');
      }
    } catch (error) {
      console.error(error);

      // Check for specific error codes indicating incorrect password
      if (error.code === 'auth/wrong-password') {
        window.alert('Incorrect password. Please try again.');
      } else {
        window.alert(error.message || 'Failed to sign in. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user has the admin role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        // User has signed in successfully and has the admin role
        router.push('/Admin');
      } else {
        // User does not have the admin role
        window.alert('You do not have permission to access this page.');
        await signOut(auth); // Sign out the user if they don't have the admin role
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 bg-white lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">Admin Sign In</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 bg-white">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 bg-white">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-white"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-3 py-2 m-2 text-sm font-semibold leading-6 text-white bg-orange-600 rounded-md shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex justify-center w-full px-3 py-2 m-2 text-sm font-semibold leading-6 bg-white rounded-md shadow-sm text-slate-700 hover:bg-slate-300 focus:outline-none"
            >
              <FcGoogle className="mx-4 text-2xl" /> Sign In with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
