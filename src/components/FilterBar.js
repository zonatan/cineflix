import React from 'react';

const FilterBar = ({ onFilterChange }) => {
  return (
    <div>
      <label htmlFor="filter" className="mr-2 text-gray-400">Filter:</label>
      <select
        id="filter"
        className="bg-gray-800 border border-gray-700 text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="">All</option>
        <option value="movie">Movies</option>
        <option value="series">Series</option>
      </select>
    </div>
  );
};

export default FilterBar;