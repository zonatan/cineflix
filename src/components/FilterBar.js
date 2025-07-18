import React, { useState, useEffect, useRef } from 'react';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FilterBar = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filters = [
    { value: '', label: 'Semua' },
    { value: 'movie', label: 'Film' },
    { value: 'series', label: 'Series' },
  ];

  const handleFilterSelect = (value) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800/80 border border-gray-700/50 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FiFilter className="text-blue-400" />
        <span className="text-sm font-medium">Filter</span>
        <FiChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 max-h-64 bg-gray-800 border border-gray-700/50 rounded-lg shadow-lg z-50 overflow-y-auto custom-scrollbar"
            style={{
              scrollbarWidth: 'thin', // Untuk Firefox
              scrollbarColor: 'rgba(59, 130, 246, 0.8) rgba(31, 41, 55, 0.3)', // Untuk Firefox
            }}
          >
            <style>
              {`
                /* Custom Scrollbar untuk Dropdown */
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(31, 41, 55, 0.3); /* bg-gray-800/30 */
                  border-radius: 4px;
                  margin: 2px 0;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(59, 130, 246, 0.8); /* bg-blue-500/80 */
                  border-radius: 4px;
                  box-shadow: 0 0 6px rgba(59, 130, 246, 0.4); /* Efek glow */
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: rgba(59, 130, 246, 1); /* bg-blue-500 */
                  box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
                }
              `}
            </style>
            <div>
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => handleFilterSelect(filter.value)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/80 hover:text-blue-300 transition-all duration-150"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;