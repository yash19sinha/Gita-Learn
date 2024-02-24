// components/SearchBar.js
"use client"
// components/SearchBar.js
import { useState } from 'react';
import axios from 'axios';
import SearchResults from '../components/SearchResults';
import Router from 'next/navigation';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('https://gita-ml-search.onrender.com/search', { user_query: searchQuery });
      setSearchResults([response.data]); // Ensure searchResults is an array with the response data as its single element
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Internal server error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full mt-10 bg-white">
      <div className="flex items-center px-4 py-2 border border-gray-300 rounded-full w-96">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-black bg-white focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 ml-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {searchResults.length > 0 && <SearchResults searchResults={searchResults}  />}
    </div>
  );
};

export default SearchBar;
