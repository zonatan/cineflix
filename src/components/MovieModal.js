import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiStar, FiClock, FiCalendar, FiAward, FiGlobe, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaImdb, FaHeart, FaRegHeart } from 'react-icons/fa';

const MovieModal = ({ isOpen, onClose, movieId, favorites, toggleFavorite }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && movieId) {
      setLoading(true);
      setError(null);
      axios
        .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=videos,credits`)
        .then((response) => {
          const movie = response.data;
          const trailer = movie.videos.results.find(
            (video) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          setMovieDetails({
            imdbID: movie.id.toString(),
            Title: movie.title,
            Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
            profileImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
            coverImage: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'N/A',
            trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
            Type: 'movie',
            Rated: movie.adult ? 'R' : 'PG-13',
            Runtime: movie.runtime ? `${movie.runtime} min` : 'N/A',
            Genre: movie.genres.map(genre => genre.name).join(', '),
            Plot: movie.overview || 'N/A',
            Director: movie.credits.crew.find(crew => crew.job === 'Director')?.name || 'N/A',
            Writer: movie.credits.crew.filter(crew => crew.job === 'Writer').map(w => w.name).join(', ') || 'N/A',
            Actors: movie.credits.cast.slice(0, 3).map(actor => actor.name).join(', ') || 'N/A',
            Language: movie.spoken_languages.map(lang => lang.name).join(', ') || 'N/A',
            Country: movie.production_countries.map(country => country.name).join(', ') || 'N/A',
            Awards: 'N/A',
            imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            BoxOffice: movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A',
            Production: movie.production_companies.map(company => company.name).join(', ') || 'N/A',
            Website: movie.homepage || 'N/A',
            DVD: movie.release_date || 'N/A',
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Gagal memuat detail film.');
          setLoading(false);
        });
    }
  }, [isOpen, movieId]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isFavorite = movieDetails && favorites.some(fav => fav.imdbID === movieDetails.imdbID);

  const images = movieDetails
    ? [movieDetails.coverImage || movieDetails.Poster, movieDetails.coverImage].filter(img => img && img !== 'N/A')
    : [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
        aria-label="Detail Film"
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
            aria-label="Tutup modal"
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
              <h3 className="text-xl font-bold text-white mb-2">Oops, terjadi kesalahan!</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  axios
                    .get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=videos,credits`)
                    .then((response) => {
                      const movie = response.data;
                      const trailer = movie.videos.results.find(
                        (video) => video.type === 'Trailer' && video.site === 'YouTube'
                      );
                      setMovieDetails({
                        imdbID: movie.id.toString(),
                        Title: movie.title,
                        Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                        Poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
                        profileImage: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'N/A',
                        coverImage: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'N/A',
                        trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
                        Type: 'movie',
                        Rated: movie.adult ? 'R' : 'PG-13',
                        Runtime: movie.runtime ? `${movie.runtime} min` : 'N/A',
                        Genre: movie.genres.map(genre => genre.name).join(', '),
                        Plot: movie.overview || 'N/A',
                        Director: movie.credits.crew.find(crew => crew.job === 'Director')?.name || 'N/A',
                        Writer: movie.credits.crew.filter(crew => crew.job === 'Writer').map(w => w.name).join(', ') || 'N/A',
                        Actors: movie.credits.cast.slice(0, 3).map(actor => actor.name).join(', ') || 'N/A',
                        Language: movie.spoken_languages.map(lang => lang.name).join(', ') || 'N/A',
                        Country: movie.production_countries.map(country => country.name).join(', ') || 'N/A',
                        Awards: 'N/A',
                        imdbRating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
                        BoxOffice: movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A',
                        Production: movie.production_companies.map(company => company.name).join(', ') || 'N/A',
                        Website: movie.homepage || 'N/A',
                        DVD: movie.release_date || 'N/A',
                      });
                      setLoading(false);
                    })
                    .catch(() => {
                      setError('Gagal memuat detail film.');
                      setLoading(false);
                    });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Coba Lagi
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
                <div className="relative w-full h-full">
                  {images.length > 0 ? (
                    <>
                      <img
                        src={images[currentImageIndex] || 'https://via.placeholder.com/800x450/1a1a2e/ffffff?text=Tidak+Ada+Poster'}
                        className="w-full h-60 sm:h-72 md:h-80 object-cover"
                        alt={`${movieDetails.Title} ${currentImageIndex === 0 ? 'Sampul' : 'Profil'}`}
                        loading="lazy"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full p-2 transition"
                            aria-label="Gambar sebelumnya"
                          >
                            <FiChevronLeft size={20} />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full p-2 transition"
                            aria-label="Gambar berikutnya"
                          >
                            <FiChevronRight size={20} />
                          </button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-500/50'}`}
                                onClick={() => setCurrentImageIndex(index)}
                                aria-label={`Ke gambar ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <img
                      src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/800x450/1a1a2e/ffffff?text=Tidak+Ada+Poster'}
                      className="w-full h-60 sm:h-72 md:h-80 object-cover"
                      alt={movieDetails.Title}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="w-28 sm:w-32 h-40 sm:h-48 rounded-lg overflow-hidden shadow-lg border border-white/10">
                      <img
                        src={movieDetails.profileImage || movieDetails.Poster !== 'N/A' ? movieDetails.Poster : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=Tidak+Ada+Poster'}
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
                <div className="flex gap-4 mb-6">
                  {movieDetails.trailerUrl && (
                    <a
                      href={movieDetails.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <FiPlay size={16} /> Tonton Trailer
                    </a>
                  )}
                  <button
                    onClick={() => toggleFavorite(movieDetails)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    {isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                  </button>
                </div>
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
                    <h3 className="text-lg font-bold text-white mb-2">Sinopsis</h3>
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
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Sutradara</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Director}</p>
                      </div>
                    )}
                    {movieDetails.Writer && movieDetails.Writer !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Penulis</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Writer}</p>
                      </div>
                    )}
                    {movieDetails.Actors && movieDetails.Actors !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Pemeran</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Actors}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    {movieDetails.Language && movieDetails.Language !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Bahasa</h4>
                        <p className="text-gray-100 text-sm flex items-center gap-1">
                          <FiGlobe size={14} className="text-blue-400" /> {movieDetails.Language}
                        </p>
                      </div>
                    )}
                    {movieDetails.Country && movieDetails.Country !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Negara</h4>
                        <p className="text-gray-100 text-sm">{movieDetails.Country}</p>
                      </div>
                    )}
                    {movieDetails.Awards && movieDetails.Awards !== 'N/A' && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1">Penghargaan</h4>
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
                          <h4 className="text-xs font-semibold text-gray-400 mb-1">Produksi</h4>
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
                            Kunjungi Situs
                          </a>
                        </div>
                      )}
                      {movieDetails.DVD && movieDetails.DVD !== 'N/A' && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-400 mb-1">Tanggal Rilis</h4>
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