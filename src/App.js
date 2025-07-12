import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaChevronLeft, FaChevronRight, FaPlay, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiSearch, FiFilter, FiClock } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import SearchBar from './components/SearchBar';
import MovieList from './components/MovieList';
import MovieModal from './components/MovieModal';
import FilterBar from './components/FilterBar';
import SearchHistory from './components/SearchHistory';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState('avengers');
  const [type, setType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem('searchHistory')) || []
  );
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites')) || []
  );
  const [scrolled, setScrolled] = useState(false);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchMovies = async (searchQuery, pageNum = 1, typeFilter = '') => {
    setLoading(true);
    setError(null);
    try {
      const [response1, response2] = await Promise.all([
        axios.get(
          `https://www.omdbapi.com/?s=${searchQuery}&type=${typeFilter}&page=${pageNum}&apikey=${process.env.REACT_APP_API_MOVIE_KEY}`
        ),
        axios.get(
          `https://www.omdbapi.com/?s=${searchQuery}&type=${typeFilter}&page=${pageNum + 1}&apikey=${process.env.REACT_APP_API_MOVIE_KEY}`
        ),
      ]);

      let combinedMovies = [];
      let total = 0;

      if (response1.data.Response === 'True') {
        combinedMovies = [...response1.data.Search];
        total = parseInt(response1.data.totalResults);
      }
      if (response2.data.Response === 'True') {
        combinedMovies = [...combinedMovies, ...response2.data.Search];
      }

      if (combinedMovies.length > 0) {
        setMovies(combinedMovies.slice(0, ITEMS_PER_PAGE));
        setTotalResults(total);
        if (!searchHistory.includes(searchQuery)) {
          const updatedHistory = [searchQuery, ...searchHistory.slice(0, 4)];
          setSearchHistory(updatedHistory);
          localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        }
      } else {
        setError(response1.data.Error || 'No results found.');
        setMovies([]);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setMovies([]);
    }
    setLoading(false);
  };

  const toggleFavorite = (movie) => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    searchMovies(query, page, type);
  }, [page, type]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    searchMovies(searchQuery, 1, type);
  };

  const handleFilterChange = (typeFilter) => {
    setType(typeFilter);
    setPage(1);
    searchMovies(query, 1, typeFilter);
  };

  const handleCardClick = (imdbID) => {
    setSelectedMovieId(imdbID);
    setModalOpen(true);
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    setPage(1);
    searchMovies(historyQuery, 1, type);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Modern Sticky Header */}
      <header className={`sticky top-0 z-50 bg-gray-900/${scrolled ? '95' : '100'} backdrop-blur-sm border-b border-gray-800/50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaPlay className="text-blue-400 text-xl" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
              CINEFLIX
            </h1>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) handleSearch(query);
            }}>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-full px-4 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Search movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>
          
          <nav className="flex items-center space-x-4">
            <button 
              onClick={() => handleFilterChange(type === 'movie' ? '' : 'movie')}
              className={`${type === 'movie' ? 'text-blue-400' : 'text-gray-400'} hover:text-white transition`}
            >
              <FiFilter className="text-lg" />
            </button>
            <SearchHistory history={searchHistory} onHistoryClick={handleHistoryClick} />
          </nav>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden container mx-auto px-4 py-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center my-16">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-spin"></div>
              <FaPlay className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 text-xl animate-pulse" />
            </div>
            <p className="text-blue-300">Loading movies...</p>
          </div>
        )}

        {error && (
          <div className="bg-gray-800/90 border border-gray-700 rounded-lg p-6 text-center my-8">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        <MovieList 
          movies={movies} 
          onCardClick={handleCardClick}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        {movies.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
            <button
              className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${page === 1 ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
              onClick={() => setPage(prev => prev - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
              Previous
            </button>
            
            <div className="flex items-center gap-2 bg-gray-800 px-5 py-2 rounded-lg">
              <span>Page</span>
              <span className="font-bold">{page}</span>
              <span>of</span>
              <span>{Math.ceil(totalResults / ITEMS_PER_PAGE)}</span>
            </div>
            
            <button
              className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${page * ITEMS_PER_PAGE >= totalResults ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * ITEMS_PER_PAGE >= totalResults}
            >
              Next
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {modalOpen && (
          <MovieModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            imdbID={selectedMovieId}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full p-3 shadow-lg transition"
        >
          <FaChevronLeft className="transform rotate-90" />
        </button>
      )}
    </div>
  );
};

export default App;