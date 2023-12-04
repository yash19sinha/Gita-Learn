'use client'
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation'
import Link from 'next/link';


const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User has signed in successfully
      setEmail('');
      setPassword('');
      router.push('/');
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 bg-white lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="w-auto h-10 mx-auto"
            src="https://i0.wp.com/cdn.prabhupadaworld.com/wp-content/uploads/2021/10/logo.webp?w=500&ssl=1"
            alt="Your Company"
          />
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
            Sign in to your account
          </h2>
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 bg-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="/forgetpassword" className="font-semibold text-orange-600 bg-white hover:text-orange-500">
                    Forgot password?
                  </a>
                </div>
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 bg-white"
                />
              </div>
            </div>

            <div>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Sign in
              </button>
          
            </div>
          </form>

          <p className="mt-10 text-sm text-center text-gray-500">
            Not a member?{' '}
            <a href="/signup.js" className="font-semibold leading-6 text-orange-600 hover:text-orange-500">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;