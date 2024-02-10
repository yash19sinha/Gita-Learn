// components/SearchBar.js
import { useState } from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';
import Router from 'next/navigation';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/search', { user_query: searchQuery });
      setSearchResults([response.data]); // Ensure searchResults is an array with the response data as its single element
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Internal server error');
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-500"
      />
      <button onClick={handleSearch} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-r hover:bg-blue-600 focus:outline-none">
        Search
      </button>
      {error && <p className="ml-4 text-red-500">{error}</p>}
      {searchResults.length > 0 && <SearchResults searchResults={searchResults} />}
    </div>
  );
};

export default SearchBar;
