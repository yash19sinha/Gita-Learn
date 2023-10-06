import React from 'react'


export const Navbar = () => {
  let links = [
    { name: "HOME", link: "/" },
    { name: 'Bhagvad Gita', link: '/' },
    { name: 'Chapters', link: '/' },
    { name: 'Quotes', link: '/' },
  ];
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
    <div className="navbar bg-gray-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li className='text-2xl'><a>Home</a></li>
            <li><a>Bhagvad Gita</a></li>
            <div className="flex items-center max-w-xs mx-auto rounded-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 rounded-full focus:outline-none"
              />
            </div>


            <li>
              <a>Chapters</a>
              <ul className="p-2">
                <li><a>Chapter 1</a></li>
                <li><a>Chapter 2</a></li>
              </ul>
            </li>
            <li><a>Quotes</a></li>
          </ul>
        </div>



        <a className="text-2xl font-bold normal-case btn btn-ghost">GitaLearn</a>
      </div>
      <div className="hidden navbar-center lg:flex">
        <ul className="gap-4 px-1 menu menu-horizontal">
          <li className='text-lg font-semibold'><a>Home</a></li>
          <li className='text-lg font-semibold'><a>Bhagvad Gita</a></li>
          <div className="form-control">
            <input type="text" placeholder="Search" className="w-24 input input-bordered md:w-auto" />
          </div>
          <li tabIndex={0}>
            <details>
              <summary className='text-lg font-semibold'>Chapters</summary>
              <ul className="p-2">
                <li><a>Chapter 1</a></li>
                <li><a>Chapter 2</a></li>
              </ul>
            </details>
          </li>
          <li className='text-lg font-semibold'><a>Quotes</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn bg-orange-600 text-white border-none">Login</a>
      </div>
    </div>
  )
}
