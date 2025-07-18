import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaChevronLeft, FaChevronRight, FaPlay, FaHeart, FaRegHeart, FaStar, FaTimes } from 'react-icons/fa';
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
  const [query, setQuery] = useState('');
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

  const ITEMS_PER_PAGE = 40;
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchMovies = async (searchQuery = '', pageNum = 1, typeFilter = '') => {
    setLoading(true);
    setError(null);
    try {
      let response;
      let endpoint = '';
      if (searchQuery.trim()) {
        endpoint = typeFilter === 'series'
          ? `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${pageNum}`
          : `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${pageNum}`;
      } else {
        endpoint = typeFilter === 'series'
          ? `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${pageNum}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=${pageNum}`;
      }

      response = await axios.get(endpoint);

      const results = response.data.results;
      const total = response.data.total_results;

      const enhancedMovies = await Promise.all(
        results.map(async (item) => {
          try {
            const videoResponse = await axios.get(
              `https://api.themoviedb.org/3/${typeFilter === 'series' ? 'tv' : 'movie'}/${item.id}/videos?api_key=${TMDB_API_KEY}`
            );
            const trailer = videoResponse.data.results.find(
              (video) => video.type === 'Trailer' && video.site === 'YouTube'
            );
            return {
              imdbID: item.id.toString(),
              Title: typeFilter === 'series' ? item.name : item.title,
              Year: item.release_date || item.first_air_date ? (item.release_date || item.first_air_date).split('-')[0] : 'N/A',
              Poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'N/A',
              profileImage: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'N/A',
              coverImage: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : 'N/A',
              trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
              Type: typeFilter === 'series' ? 'series' : 'movie',
              Rated: item.adult ? 'R' : 'PG-13',
              Runtime: item.runtime ? `${item.runtime} min` : 'N/A',
              Genre: item.genre_ids.map(id => id.toString()).join(', '),
              Plot: item.overview || 'N/A',
              Director: 'N/A',
              Writer: 'N/A',
              Actors: 'N/A',
              Language: item.original_language || 'N/A',
              Country: 'N/A',
              Awards: 'N/A',
              imdbRating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
              BoxOffice: item.revenue ? `$${item.revenue.toLocaleString()}` : 'N/A',
              Production: 'N/A',
              Website: item.homepage || 'N/A',
              DVD: item.release_date || item.first_air_date || 'N/A',
            };
          } catch (err) {
            console.error(`Gagal mengambil data tambahan untuk ${typeFilter === 'series' ? item.name : item.title}:`, err);
            return null;
          }
        })
      );

      const filteredMovies = enhancedMovies.filter(movie => movie !== null);

      if (filteredMovies.length > 0) {
        setMovies(filteredMovies.slice(0, ITEMS_PER_PAGE));
        setTotalResults(total);
        if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
          const updatedHistory = [searchQuery, ...searchHistory.slice(0, 4)];
          setSearchHistory(updatedHistory);
          localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        }
      } else {
        setError('Tidak ada hasil ditemukan.');
        setMovies([]);
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
    fetchMovies(query, page, type);
  }, [page, type]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    fetchMovies(searchQuery, 1, type);
  };

  const handleFilterChange = (typeFilter) => {
    setType(typeFilter);
    setPage(1);
    fetchMovies(query, 1, typeFilter);
  };

  const handleCardClick = (imdbID) => {
    setSelectedMovieId(imdbID);
    setModalOpen(true);
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    setPage(1);
    fetchMovies(historyQuery, 1, type);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/30 to-gray-950/80 z-0 pointer-events-none"></div>
      
      {/* Film Grain Effect */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmFpbiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDApIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWluKSIvPjwvc3ZnPg==')] opacity-10 z-0 pointer-events-none"></div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Montserrat', sans-serif;
          }
          
          /* Enhanced Scrollbar */
          html {
            scrollbar-width: thin;
            scrollbar-color: rgba(59, 130, 246, 0.8) rgba(15, 23, 42, 0.3);
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 4px;
            margin: 4px 0;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 4px;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
          }
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
          }
          
          /* Text Shadow for Better Readability */
          .text-shadow {
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }
          
          /* Cinematic Border */
          .cinematic-border {
            position: relative;
          }
          .cinematic-border::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
          }
          .cinematic-border::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent);
          }
        `}
      </style>

      {/* Header - Professional and Polished Design */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-950/95 py-2 shadow-2xl' : 'bg-gradient-to-b from-gray-950/90 to-transparent py-3'}`} >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo with Cinematic Flare */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <FaPlay className="text-blue-400 text-2xl z-10 relative" />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              CINEFLIX
            </h1>
          </motion.div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-6 pt-6">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Navigation - Filter, History, Favorites */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <FilterBar onFilterChange={handleFilterChange} />
            <SearchHistory history={searchHistory} onHistoryClick={handleHistoryClick} />
            <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-300">
              <FaHeart className="text-pink-500 text-lg" />
            </button>
          </nav>
        </div>
        {/* Search Bar - Mobile */}
        <div className="sm:hidden px-4 pt-2 pb-3">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content - Cinematic Layout */}
      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 relative z-10">
        {/* Featured Section - Hero Banner */}
        {movies.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden cinematic-border">
              <img 
                src={movies[0].coverImage || 'https://via.placeholder.com/1280x720'} 
                alt={movies[0].Title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray | -950/80 via-gray-950/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full">
                <div className="max-w-2xl">
                  <h2 className="text-2xl sm:text-4xl font-bold text-shadow mb-2">{movies[0].Title}</h2>
                  <div className="flex items-center space-x-4 text-shadow mb-4">
                    <span className="flex items-center text-yellow-400">
                      <FaStar className="mr-1" />
                      {movies[0].imdbRating}
                    </span>
                    <span>{movies[0].Year}</span>
                    <span>{movies[0].Runtime}</span>
                  </div>
                  <p className="text-gray-300 text-shadow mb-6 line-clamp-2">{movies[0].Plot}</p>
                  <div className="flex space-x-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-full flex items-center space-x-2 transition-colors duration-300">
                      <FaPlay size={14} />
                      <span>Putar</span>
                    </button>
                    <button 
                      onClick={() => handleCardClick(movies[0].imdbID)}
                      className="bg-gray-800/70 hover:bg-gray-700/90 text-white px-4 sm:px-6 py-2 rounded-full border border-gray-700 transition-colors duration-300"
                    >
                      Info Selengkapnya
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Movie Grid - Modern Card Design */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {query ? `Hasil untuk "${query}"` : type === 'series' ? 'Serial Populer' : 'Film Populer'}
            </h2>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center my-24">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaPlay className="text-blue-400 text-2xl animate-pulse" />
                </div>
              </div>
              <p className="text-blue-300 font-medium">Memuat film...</p>
            </div>
          )}

          {error && (
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 text-center my-12 max-w-md mx-auto">
              <div className="bg-red-500/10 p-4 rounded-full inline-flex mb-4">
                <IoMdClose className="text-red-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => setError(null)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300"
              >
                Coba Lagi
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <motion.div 
                key={movie.imdbID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCardClick(movie.imdbID)}
                className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                <div className="relative aspect-[2/3]">
                  <img 
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} 
                    alt={movie.Title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(movie);
                      }}
                      className="p-2 bg-gray-900/70 rounded-full hover:bg-pink-600/80 transition-colors duration-300"
                    >
                      {favorites.some(fav => fav.imdbID === movie.imdbID) ? 
                        <FaHeart className="text-pink-500" /> : 
                        <FaRegHeart className="text-white" />
                      }
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-shadow line-clamp-1">{movie.Title}</h3>
                  <div className="flex justify-between items-center mt-1 text-sm text-gray-300">
                    <span>{movie.Year}</span>
                    <div className="flex items-center space-x-1">
                      <FaStar className="text-yellow-400" />
                      <span>{movie.imdbRating}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300">
                  <FaPlay className="text-white text-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pagination - Modern Design */}
        {movies.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 sm:mt-16 gap-4">
            <button
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${page === 1 ? 'bg-gray-900/50 text-gray-500' : 'bg-gray-900/70 hover:bg-gray-800 text-white shadow-lg'}`}
              onClick={() => setPage(prev => prev - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
              <span>Sebelumnya</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4 bg-gray-900/70 px-4 sm:px-6 py-3 rounded-full shadow-lg">
              {Array.from({ length: Math.min(5, Math.ceil(totalResults / ITEMS_PER_PAGE)) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${page === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {Math.ceil(totalResults / ITEMS_PER_PAGE) > 5 && (
                <span className="mx-1 sm:mx-2">...</span>
              )}
            </div>
            
            <button
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${page * ITEMS_PER_PAGE >= totalResults ? 'bg-gray-900/50 text-gray-500' : 'bg-gray-900/70 hover:bg-gray-800 text-white shadow-lg'}`}
              onClick={() => setPage(prev => prev + 1)}
              disabled={page * ITEMS_PER_PAGE >= totalResults}
            >
              <span>Berikutnya</span>
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>

      {/* Modal - Cinematic Style */}
      <AnimatePresence>
        {modalOpen && (
          <MovieModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            movieId={selectedMovieId}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* Back to Top Button - Animated */}
      {scrolled && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-full p-4 shadow-xl transition-all duration-300 z-40"
        >
          <FaChevronLeft className="transform rotate-90 text-blue-400" />
        </motion.button>
      )}

      {/* Footer - Minimalist Design */}
      <footer className="bg-gray-950/80 border-t border-gray-800/50 py-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <FaPlay className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                CINEFLIX
              </h2>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CINEFLIX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;