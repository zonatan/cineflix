import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaChevronLeft, FaChevronRight, FaPlay, FaHeart, FaRegHeart, FaStar, FaTimes } from 'react-icons/fa';
import { FiSearch, FiFilter, FiClock } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import MovieModal from './components/MovieModal';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari film atau serial..."
          className="w-full bg-gray-800/70 border border-gray-700 rounded-full py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <FiSearch size={20} />
        </button>
      </div>
    </form>
  );
};

const FilterBar = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('');

  const handleFilter = (type) => {
    setActiveFilter(type);
    onFilterChange(type);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleFilter('')}
        className={`px-3 py-1 rounded-full text-sm ${activeFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'}`}
      >
        Semua
      </button>
      <button
        onClick={() => handleFilter('movie')}
        className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'movie' ? 'bg-blue-600 text-white' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'}`}
      >
        Film
      </button>
      <button
        onClick={() => handleFilter('series')}
        className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'series' ? 'bg-blue-600 text-white' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'}`}
      >
        Serial
      </button>
    </div>
  );
};

const SearchHistory = ({ history, onHistoryClick }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="p-2 rounded-full bg-gray-800/70 hover:bg-gray-700 text-gray-300"
      >
        <FiClock size={18} />
      </button>
      
      {showHistory && history.length > 0 && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  onHistoryClick(item);
                  setShowHistory(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MovieCard = ({ movie, onClick, isFavorite, toggleFavorite }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
      onClick={() => {
        console.log('Card clicked:', movie.imdbID); // Debugging
        onClick(movie.imdbID);
      }}
    >
      <div className="relative aspect-[2/3] w-full">
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
            {isFavorite ? (
              <FaHeart className="text-pink-500" />
            ) : (
              <FaRegHeart className="text-white" />
            )}
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
    </motion.div>
  );
};

const MovieList = ({ movies, onCardClick, favorites, toggleFavorite }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={onCardClick}
          isFavorite={favorites.some(fav => fav.imdbID === movie.imdbID)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
};

const FavoritesPage = ({ favorites, toggleFavorite, onBack }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-500 transition-colors duration-300"
      >
        <FaChevronLeft />
        <span>Kembali</span>
      </button>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-8">Favorit Anda</h2>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>Belum ada film atau serial favorit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onClick={() => console.log('Favorite clicked:', movie.imdbID)} // Debugging
              isFavorite={true}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [showFavorites, setShowFavorites] = useState(false);

  const ITEMS_PER_PAGE = 18;
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('modalOpen:', modalOpen, 'selectedMovieId:', selectedMovieId); // Debugging
  }, [modalOpen, selectedMovieId]);

  const fetchMovies = async (searchQuery = '', pageNum = 1, typeFilter = '') => {
    setLoading(true);
    setError(null);
    try {
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

      const response = await axios.get(endpoint);
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
            console.error(`Failed to fetch additional data for ${item.id}:`, err);
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
        setError('No results found.');
        setMovies([]);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
    if (!showFavorites) {
      fetchMovies(query, page, type);
    }
  }, [page, type, showFavorites]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setShowFavorites(false);
    fetchMovies(searchQuery, 1, type);
  };

  const handleFilterChange = (typeFilter) => {
    setType(typeFilter);
    setPage(1);
    setShowFavorites(false);
    fetchMovies(query, 1, typeFilter);
  };

  const handleCardClick = (imdbID) => {
    console.log('Clicked movie ID:', imdbID); // Debugging
    setSelectedMovieId(imdbID);
    setModalOpen(true);
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    setPage(1);
    setShowFavorites(false);
    fetchMovies(historyQuery, 1, type);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <div className="fixed inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/30 to-gray-950/80 z-0 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmFpbiIgd2lkdGg9IjQiIGhlaWdodD0iNCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDApIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyYWluKSIvPjwvc3ZnPg==')] opacity-10 z-0 pointer-events-none"></div>

      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-950/95 py-2 shadow-2xl backdrop-blur-sm' : 'bg-gradient-to-b from-gray-950/90 to-transparent py-3'}`}>
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 py-2">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
                <FaPlay className="text-blue-400 text-xl sm:text-2xl z-10 relative" />
                <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                CINEFLIX
              </h1>
            </motion.div>
          </div>

          <div className="w-full sm:max-w-lg mx-0 sm:mx-4">
            <SearchBar onSearch={handleSearch} />
          </div>

          <nav className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-normal">
            <FilterBar onFilterChange={handleFilterChange} />
            <SearchHistory history={searchHistory} onHistoryClick={handleHistoryClick} />
            <button
              onClick={() => setShowFavorites(true)}
              className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors duration-300 relative"
            >
              <FaHeart className="text-pink-500 text-lg" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 relative z-10">
        {showFavorites ? (
          <FavoritesPage
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            onBack={() => setShowFavorites(false)}
          />
        ) : (
          <>
            {movies.length > 0 && (
              <section className="mb-8 sm:mb-12">
                <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden">
                  <img
                    src={movies[0].coverImage || 'https://via.placeholder.com/1280x720'}
                    alt={movies[0].Title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 sm:p-8 w-full">
                    <div className="max-w-2xl">
                      <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">{movies[0].Title}</h2>
                      <div className="flex items-center space-x-4 text-white mb-4">
                        <span className="flex items-center text-yellow-400">
                          <FaStar className="mr-1" />
                          {movies[0].imdbRating}
                        </span>
                        <span>{movies[0].Year}</span>
                        <span>{movies[0].Runtime}</span>
                      </div>
                      <p className="text-gray-300 mb-6 line-clamp-2">{movies[0].Plot}</p>
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

            <section>
              <div className="mb-6 sm:mb-8 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {query ? `Hasil untuk "${query}"` : type === 'series' ? 'Serial Populer' : 'Film Populer'}
                </h2>
                {movies.length > 0 && (
                  <div className="text-sm text-gray-400">
                    {Math.min(page * ITEMS_PER_PAGE, totalResults)} dari {totalResults} hasil
                  </div>
                )}
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

              <MovieList
                movies={movies}
                onCardClick={handleCardClick}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </section>

            {movies.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 sm:mt-16 gap-4">
                <button
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${page === 1 ? 'bg-gray-900/50 text-gray-500 cursor-not-allowed' : 'bg-gray-900/70 hover:bg-gray-800 text-white shadow-lg'}`}
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
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${page === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
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
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${page * ITEMS_PER_PAGE >= totalResults ? 'bg-gray-900/50 text-gray-500 cursor-not-allowed' : 'bg-gray-900/70 hover:bg-gray-800 text-white shadow-lg'}`}
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page * ITEMS_PER_PAGE >= totalResults}
                >
                  <span>Berikutnya</span>
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {modalOpen && (
          <MovieModal
            isOpen={modalOpen}
            onClose={() => {
              console.log('Closing modal'); // Debugging
              setModalOpen(false);
              setSelectedMovieId(null);
            }}
            movieId={selectedMovieId}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

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