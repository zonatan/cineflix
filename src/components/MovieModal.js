import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiClock, FiCalendar, FiAward, FiGlobe } from 'react-icons/fi';
import { FaImdb } from 'react-icons/fa';

const MovieModal = ({ isOpen, onClose, imdbID }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && imdbID) {
      setLoading(true);
      setError(null);
      axios
        .get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_API_MOVIE_KEY}`)
        .then((response) => {
          if (response.data.Response === 'True') {
            setMovieDetails(response.data);
          } else {
            setError(response.data.Error);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch movie details.');
          setLoading(false);
        });
    }
  }, [isOpen, imdbID]);

  // Menutup modal saat tombol Esc ditekan
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-start p-4 sm:p-6 pt-8 sm:pt-12 md:pt-16 overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Movie Details Modal"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-3xl w-full sm:max-w-4xl overflow-hidden border border-gray-700/50 shadow-xl my-4 sm:my-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full p-2 backdrop-blur-sm border border-gray-600/30 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>

          {loading && (
            <div className="flex flex-col items-center justify-center h-96 p-6">
              <FiStar className="animate-spin text-blue-500 text-4xl mb-4" />
              <div className="space-y-3 w-full max-w-md">
                <div className="h-6 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-48 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-2">Oops, something went wrong!</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  axios
                    .get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_API_MOVIE_KEY}`)
                    .then((response) => {
                      if (response.data.Response === 'True') {
                        setMovieDetails(response.data);
                      } else {
                        setError(response.data.Error);
                      }
                      setLoading(false);
                    })
                    .catch(() => {
                      setError('Failed to fetch movie details.');
                      setLoading(false);
                    });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Retry
              </button>
            </div>
          )}

          {movieDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="relative h-60 sm:h-72 md:h-80 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent z-10"></div>
                <img
                  src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/800x450/1a1a2e/ffffff?text=No+Poster'}
                  className="w-full h-full object-cover"
                  alt={movieDetails.Title}
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="w-28 sm:w-32 h-40 sm:h-48 rounded-lg overflow-hidden shadow-lg border border-white/10">
                      <img
                        src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster'}
                        className="w-full h-full object-cover"
                        alt={movieDetails.Title}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{movieDetails.Title}</h2>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                        {movieDetails.Year && (
                          <span className="flex items-center gap-1 bg-blue-600/20 text-blue-100 px-2.5 py-1 rounded-full text-xs sm:text-sm border border-blue-500/20">
                            <FiCalendar size={14} /> {movieDetails.Year}
                          </span>
                        )}
                        {movieDetails.Rated && movieDetails.Rated !== 'N/A' && (
                          <span className="bg-gray-700/20 text-gray-100 px-2.5 py-1 rounded-full text-xs sm:text-sm border border-gray-600/20">
                            {movieDetails.Rated}
                          </span>
                        )}
                        {movieDetails.Runtime && movieDetails.Runtime !== 'N/A' && (
                          <span className="flex items-center gap-1 bg-gray-700/20 text-gray-100 px-2.5 py-1 rounded-full text-xs sm:text-sm border border-gray-600/20">
                            <FiClock size={14} /> {movieDetails.Runtime}
                          </span>
                        )}
                        {movieDetails.imdbRating && movieDetails.imdbRating !== 'N/A' && (
                          <span className="flex items-center gap-1 bg-yellow-600/20 text-yellow-100 px-2.5 py-1 rounded-full text-xs sm:text-sm border border-yellow-500/20">
                            <FaImdb size={16} /> {movieDetails.imdbRating}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {movieDetails.Genre && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {movieDetails.Genre.split(',').map((genre, index) => (
                      <span
                        key={index}
                        className="bg-gray-700/30 hover:bg-gray-700/50 text-gray-100 px-3 py-1.5 rounded-full text-sm border border-gray-600/20 transition cursor-default"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </motion.div>
                )}
                {movieDetails.Plot && movieDetails.Plot !== 'N/A' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="mb-6"
                  >
                    <h3 className="text-lg font-bold text-white mb-2">Synopsis</h3>
                    <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{movieDetails.Plot}</p>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6"
                >
                  <div>
                    {movieDetails.Director && movieDetails.Director !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Director</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Director}</p>
                      </div>
                    )}
                    {movieDetails.Writer && movieDetails.Writer !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Writer</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Writer}</p>
                      </div>
                    )}
                    {movieDetails.Actors && movieDetails.Actors !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Cast</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Actors}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    {movieDetails.Language && movieDetails.Language !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Language</h4>
                        <p className="text-gray-100 text-sm flex items-center gap-1">
                          <FiGlobe size={14} className="text-blue-400" /> {movieDetails.Language}
                        </p>
                      </div>
                    )}
                    {movieDetails.Country && movieDetails.Country !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Country</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Country}</p>
                      </div>
                    )}
                    {movieDetails.Awards && movieDetails.Awards !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Awards</h4>
                        <p className="text-gray-100 text-sm flex items-center gap-1">
                          <FiAward size={14} className="text-yellow-400" /> {movieDetails.Awards}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
                {(movieDetails.BoxOffice || movieDetails.Production || movieDetails.Website || movieDetails.DVD) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/20"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {movieDetails.BoxOffice && movieDetails.BoxOffice !== 'N/A' && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 mb-1">Box Office</h4>
                          <p className="text-gray-100 text-sm">{movieDetails.BoxOffice}</p>
                        </div>
                      )}
                      {movieDetails.Production && movieDetails.Production !== 'N/A' && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 mb-1">Production</h4>
                          <p className="text-gray-100 text-sm">{movieDetails.Production}</p>
                        </div>
                      )}
                      {movieDetails.Website && movieDetails.Website !== 'N/A' && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 mb-1">Website</h4>
                          <a
                            href={movieDetails.Website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm transition"
                          >
                            Visit Site
                          </a>
                        </div>
                      )}
                      {movieDetails.DVD && movieDetails.DVD !== 'N/A' && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 mb-1">Release Date</h4>
                          <p className="text-gray-100 text-sm">{movieDetails.DVD}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;