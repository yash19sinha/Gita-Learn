"use client"
import Link from 'next/link';
import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import FullScreenComponent from '../FullScreen/FullScreenComponent';

import { useTheme } from '../context/ThemeContext';
// import SearchBar from './SearchBar';



export const Navbar = () => {
  const [user] = useAuthState(auth);
  const [chapters, setChapters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef(null);
  const [theme, setTheme] = useState('Earthy'); // Default theme

  useEffect(() => {
    // Initialize theme from local storage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Persist theme changes to local storage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    console.log('Setting data theme attribute:', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('Earthy');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://gita-learn-api.vercel.app/api/chapters');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChapters(data.chapters);
      } catch (error) {
        console.error('Error fetching chapters with descriptions:', error);
        // Handle error here
      }
    }
    fetchData();
  }, []);

  const handleThemeChange = (selectedTheme) => {
    console.log('Selected theme:', selectedTheme);
    setTheme(selectedTheme);
    console.log('Theme after setting:', selectedTheme);
    setIsOpen(false); // Close the dropdown after theme selection
  };

  const closeDropdown = () => {
    const detailsElement = document.querySelector('details');
    if (detailsElement) {
      detailsElement.removeAttribute('open');
    }
  };
  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://gita-learn-api.vercel.app/api/chapters');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChapters(data.chapters);
      } catch (error) {
        console.error('Error fetching chapters with descriptions:', error);
        // Handle error here
      }
    }
    fetchData();
  }, []);





  return (

    <div className="bg-gray-100 navbar">
      <div className="navbar-start">
        <div className=" dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="p-2 mt-3 text-black bg-white shadow menu menu-sm dropdown-content rounded-box w-52 ">
            {/* <li className='text-2xl'><Link href="/">Home</Link></li>
            <li><Link href="Chapters">Bhagvad Gita</Link></li>
            <li><Link href="QuizPage">Quiz</Link></li> */}
            <li className='text-base font-semibold'><Link href="Profile">Profile</Link></li>
            <li className='text-base font-semibold'> <Link href='/' > <FullScreenComponent /> </Link> </li>
            <li tabIndex={0}>
          <details>
            <summary className='text-base font-semibold'>Chapters</summary>
            <ul className="z-10 p-2 overflow-hidden overflow-y-auto flex-2 max-h-60 menu menu-horizontal">
              {chapters.map((chapter) => (
                <li key={chapter.chapter_number} className="grid justify-center w-32 ">
                  <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                    <p className="p-1 text-sm" onClick={() => {closeDropdown()}}>
                      Chapter {chapter.chapter_number}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>

        <li tabIndex={0}>
      <details open={isOpen} ref={detailsRef}>
        <summary className='text-lg font-semibold'>Theme</summary>
        <ul className="z-10 p-2 overflow-hidden overflow-y-auto flex-2 max-h-60 menu menu-horizontal">
          <li className='flex flex-col themes'>
            <button className="p-2 mr-2 " onClick={() => { handleThemeChange('light'); detailsRef.current.removeAttribute('open'); }}>Light</button>
            <button className="p-2 mr-2 " onClick={() => { handleThemeChange('dark'); detailsRef.current.removeAttribute('open'); }}>Dark</button>
            <button className="p-2 " onClick={() => { handleThemeChange('Ivy'); detailsRef.current.removeAttribute('open'); }}>Ivy</button>
          </li>
        </ul>
      </details>
    </li>
        

          </ul>
        </div>



        <Link href="/" className="text-2xl font-bold normal-case btn btn-ghost">
          <img
            className="w-auto h-10 mx-auto"
            src="https://i0.wp.com/cdn.prabhupadaworld.com/wp-content/uploads/2021/10/logo.webp?w=500&ssl=1"
            alt="Your Company"
          />
          GitaLearn
        </Link>

      </div>
      <div className="hidden navbar-center lg:flex ">
        <ul className="gap-8 px-1 menu menu-horizontal">
          <li className='text-lg font-semibold'><Link href="/">Home</Link></li>
          {/* <li className='text-lg font-semibold'><Link href="Chapters">Bhagvad Gita</Link></li> */}
          <li className='text-lg font-semibold'><Link href="SearchResult">Search</Link></li>
          <li className='text-lg font-semibold'><Link href="Profile">Profile</Link></li>
          {/* <div className="form-control">
            <input type="text" placeholder="Search" className="w-24 input input-bordered md:w-auto" />
          </div>  */}
          <li tabIndex={0} onBlur={closeDropdown}>
      <details open={isDropdownOpen} onClick={toggleDropdown}>
        <summary className='text-lg font-semibold'>Chapters</summary>
        <ul className="z-10 p-2 overflow-hidden overflow-y-auto flex-2 max-h-60 menu menu-horizontal">
          {chapters.map((chapter) => (
            <li key={chapter.chapter_number} className="grid justify-center w-32">
              <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                <p className="p-1 text-sm" onClick={closeDropdown}>
                  Chapter {chapter.chapter_number}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </li>

          <li className='text-lg font-semibold'> <Link href='/' > <FullScreenComponent /> </Link> </li>
          {/* <li className='text-lg font-semibold'><a>Quotes</a></li> */}

          <li tabIndex={0}>
            <details open={isOpen} ref={detailsRef}>
              <summary className='text-lg font-semibold'>Theme</summary>
              <ul className="z-10 p-2 overflow-hidden overflow-y-auto flex-2 max-h-60 menu menu-horizontal">
                <li className='flex flex-col themes'>
                  <button className="p-2 mr-2 " onClick={() => { handleThemeChange('light'); detailsRef.current.removeAttribute('open'); }}>Earthy</button>
                  <button className="p-2 mr-2 " onClick={() => { handleThemeChange('dark'); detailsRef.current.removeAttribute('open'); }}>Dark</button>
                  <button className="p-2 " onClick={() => { handleThemeChange('Earthy'); detailsRef.current.removeAttribute('open'); }}>Light</button>
                </li>
              </ul>
            </details>
          </li>


        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          // If user is authenticated, show Logout button
          <button onClick={() => auth.signOut()} className="text-white bg-orange-500 border-none btn hover:bg-orange-300">Logout</button>
        ) : (
          // If user is not authenticated, show Login button
          <Link href="/login" className="text-white bg-orange-500 border-none btn hover:bg-orange-300">Login</Link>
        )}
      </div>
    </div>
  )
}
