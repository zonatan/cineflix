import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-6 max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-full px-5 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search for movies, series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <FiSearch size={18} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;