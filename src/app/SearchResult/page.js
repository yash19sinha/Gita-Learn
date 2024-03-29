// components/SearchBar.js
"use client"
// components/SearchBar.js
import { useState } from 'react';
import axios from 'axios';
import SearchResults from '../components/SearchResults';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('https://gita-ml-search.onrender.com/search', { user_query: searchQuery });
      setSearchResults(response.data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Internal server error');
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    handleSearch(); // Perform search when the form is submitted
  };

  return (
    <div className="items-center min-h-screen px-8 mt-10">
      <form onSubmit={handleSearchSubmit} className="flex items-center w-full p-2 bg-white border border-gray-300 rounded-full">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 ml-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </form>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {searchResults.length > 0 && <SearchResults searchResults={searchResults} />}
    </div>
  );
};

export default SearchBar;