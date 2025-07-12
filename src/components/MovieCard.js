import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiStar } from 'react-icons/fi';

const MovieCard = ({ movie, onCardClick }) => {
  if (!movie?.imdbID) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer"
      onClick={() => onCardClick(movie.imdbID)}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Poster'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={movie.Title}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
            <FiPlay className="text-white text-2xl ml-1" />
          </div>
        </div>
        
        {movie.Year && (
          <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {movie.Year}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-xl font-bold truncate">{movie.Title}</h3>
        <div className="flex items-center mt-2">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="text-sm text-gray-300 capitalize">{movie.Type}</span>
        </div>
        
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default MovieCard;