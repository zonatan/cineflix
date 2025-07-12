import React from 'react';
import { FiClock } from 'react-icons/fi';

const SearchHistory = ({ history, onHistoryClick }) => {
  if (history.length === 0) return null;
  
  return (
    <div>
      <h3 className="flex items-center gap-2 text-gray-400 mb-2">
        <FiClock /> Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {history.map((item, index) => (
          <button
            key={index}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition"
            onClick={() => onHistoryClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;