import Link from 'next/link';
import React from 'react'
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const [chapters, setChapters] = useState([]);
  let links = [
    { name: "HOME", link: "/" },
    { name: 'Bhagvad Gita', link: '/' },
    { name: 'Chapters', link: '/' },
    { name: 'Quotes', link: '/' },
  ];
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:4000/api/chapters');

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
    //     <div className="p-2 mt-2 mb-2 navbar bg-base-100">
    //   <div className="flex-1">
    //     <a className="ml-8 font-bold normal-case md:text-3xl btn btn-ghost">Gita Learn</a>
    //   </div>
    //   <div className="flex-none gap-2">
    //     <div className="form-control">
    //       <input type="text" placeholder="Search" className="w-24 input input-bordered md:w-auto" />
    //     </div>
    //     <div className="dropdown dropdown-end">
    //       <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
    //         <div className="w-10 rounded-full">
    //           <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    //         </div>
    //       </label>
    //       <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
    //         <li>
    //           <a className="justify-between">
    //             Profile
    //             <span className="badge">New</span>
    //           </a>
    //         </li>
    //         <li><a>Settings</a></li>
    //         <li><a>Logout</a></li>
    //       </ul>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-gray-100 navbar">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li className='text-2xl'><Link href="/">Home</Link></li>
            <li><Link href="Chapters">Bhagvad Gita</Link></li>
            

            <li>
              <a>Chapters</a>
              <ul className="p-2 overflow-hidden overflow-y-auto max-h-32">
              {chapters.map((chapter) => (
              <li key={chapter.chapter_number} className="justify-center ">
                <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                  <p className="p-1 text-sm font-normal">Chapter {chapter.chapter_number}</p>
                 
                
                </Link>

             
              </li>
            ))}
              </ul>
            </li>
          </ul>
        </div>



        <Link href="/" className="text-2xl font-bold normal-case btn btn-ghost">GitaLearn</Link>
      </div>
      <div className="hidden navbar-center lg:flex">
        <ul className="gap-8 px-1 menu menu-horizontal">
          <li className='text-lg font-semibold'><Link href="/">Home</Link></li>
          <li className='text-lg font-semibold'><Link href="Chapters">Bhagvad Gita</Link></li>
          {/* <div className="form-control">
            <input type="text" placeholder="Search" className="w-24 input input-bordered md:w-auto" />
          </div> */}
          <li tabIndex={0}>
          <details >
            <summary className='text-lg font-semibold'>Chapters</summary>
            <ul className="z-10 p-2 overflow-hidden overflow-y-auto flex-2 max-h-60 menu menu-horizontal">
              {chapters.map((chapter) => (
                <li key={chapter.chapter_number} className="grid justify-center w-32 bg-white ">
                  <Link href={`/ChapterInfo?chapterNumber=${chapter.chapter_number}`}>
                    <p className="p-1 text-sm">Chapter {chapter.chapter_number}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          </li>
          {/* <li className='text-lg font-semibold'><a>Quotes</a></li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <Link href="/"className="text-white bg-orange-500 border-none btn hover:bg-orange-300">Login</Link>
      </div>
    </div>
  )
}
