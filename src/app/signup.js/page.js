// pages/signup.js
"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/firebase/config';
import { setDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

const SignUp = () => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional user data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name: name,
        phoneNo: phoneNo,
        score: 0, // Set initial score to 0
      });
  
      // User has signed up successfully
      setEmail('');
      setName('');
      setPhoneNo('');
      setPassword('');
  
      router.push('/');
    } catch (error) {
      console.error(error);
  
      // Check for specific error code indicating that the user already exists
      if (error.code === 'auth/email-already-in-use') {
        const errorMessage = 'User with this email already exists. Please log in.';
        setError(errorMessage);
        window.alert(errorMessage);
      } else {
        const errorMessage = 'Failed to sign up. Please try again.';
        setError(errorMessage);
        window.alert(errorMessage);
      }
    }
  };
  

  return (
  
      <div className="flex flex-col justify-center flex-1 min-h-screen px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
            className="w-auto h-16 mx-auto"
            height={600}
            width={600}
            src="https://prabhupadaworld.com/prabhupada-world-logo.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center">
            Sign Up to your Account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6">
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
              <label htmlFor="name" className="block text-sm font-medium leading-6 ">
                Enter Your Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneno" className="block text-sm font-medium leading-6">
                Enter Your Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phoneno"
                  name="phoneno"
                  type="number"
                  autoComplete="number"
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 ">
                  Create Your Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                href="/login"
                className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-sm text-center text-gray-500">
            Already a Learner?{' '}
            <a href="/login" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">
              Login Your Account
            </a>
          </p>
        </div>
      </div>
   
  );
};

export default SignUp;
