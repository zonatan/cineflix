import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, onCardClick }) => {
  // Jumlah item per baris di berbagai breakpoint
  const itemsPerRow = {
    default: 1,   // mobile
    sm: 2,        // 640px
    md: 3,        // 768px
    lg: 4         // 1024px
  };

  // Hitung jumlah placeholder yang dibutuhkan
  const calculatePlaceholders = (items) => {
    if (items.length === 0) return 0;
    
    const remainder = {
      default: items.length % itemsPerRow.default,
      sm: items.length % itemsPerRow.sm,
      md: items.length % itemsPerRow.md,
      lg: items.length % itemsPerRow.lg
    };
    
    // Return max placeholders needed across all breakpoints
    return Math.max(
      remainder.default ? itemsPerRow.default - remainder.default : 0,
      remainder.sm ? itemsPerRow.sm - remainder.sm : 0,
      remainder.md ? itemsPerRow.md - remainder.md : 0,
      remainder.lg ? itemsPerRow.lg - remainder.lg : 0
    );
  };

  const placeholdersCount = calculatePlaceholders(movies);
  const displayMovies = [...movies];
  
  // Tambahkan placeholder jika diperlukan
  for (let i = 0; i < placeholdersCount; i++) {
    displayMovies.push({ isPlaceholder: true, id: `placeholder-${i}` });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayMovies.map((movie) => (
        movie.isPlaceholder ? (
          <div 
            key={movie.id}
            className="opacity-0 pointer-events-none select-none"
            aria-hidden="true"
            style={{
              aspectRatio: '2/3' // Mempertahankan aspect ratio yang sama dengan MovieCard
            }}
          >
            {/* Empty placeholder */}
          </div>
        ) : (
          <MovieCard key={movie.imdbID} movie={movie} onCardClick={onCardClick} />
        )
      ))}
    </div>
  );
};

export default MovieList;