import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="text-lg font-bold">Your Website Name</div>
      <div className="space-x-6">
        <a href="/" className="text-gray-800">Home</a>
      </div>
      <div className="flex items-center">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="flex items-center text-gray-800 focus:outline-none"
            >
              <span className="mr-2">John Doe</span>
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 7.293a1 1 0 011.414 1.414L6 9.414V15a2 2 0 002 2h4a2 2 0 002-2v-5.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0L10 9.414l-2.293 2.293a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM14 4a3 3 0 11-6 0 3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
