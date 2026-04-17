import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Info, ThumbsUp, Heart } from "lucide-react";
import { motion } from "motion/react";
import { Movie } from "../types";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        if (data.length > 0) setFeatured(data[0]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[85vh] w-full">
          <div className="absolute inset-0">
            <img 
              src={featured.backdrop} 
              alt={featured.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 hero-overlay" />
          </div>

          <div className="absolute bottom-[15%] left-0 w-full px-4 md:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight">
                {featured.title}
              </h1>
              <div className="flex items-center space-x-4 mb-6 text-sm font-medium">
                <span className="text-green-500">{featured.rating * 10}% Match</span>
                <span className="text-gray-400">{featured.year}</span>
                <span className="px-2 py-0.5 border border-gray-600 text-xs rounded">HD</span>
                <span className="text-gray-400">{featured.duration}</span>
              </div>
              <p className="text-lg text-gray-300 mb-8 line-clamp-3 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/player/${featured.id}`}
                  className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-white/80 transition-colors"
                >
                  <Play size={24} fill="currentColor" />
                  <span>Play</span>
                </Link>
                <Link 
                  to={`/movie/${featured.id}`}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-md font-bold hover:bg-white/30 transition-colors"
                >
                  <Info size={24} />
                  <span>More Info</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Rows */}
      <div className="relative z-10 -mt-20 md:-mt-32 px-4 md:px-8 space-y-12">
        <MovieRow title="Trending Now" movies={movies} />
        <MovieRow title="New Releases" movies={movies.slice().reverse()} />
        <MovieRow title="Top Rated" movies={[...movies].sort((a, b) => b.rating - a.rating)} />
      </div>
    </div>
  );
}

function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold tracking-tight px-2">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

interface MovieCardProps {
  movie: Movie;
  key?: string;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="flex-shrink-0 group relative w-44 md:w-64 transition-transform duration-300 hover:scale-110 z-0 hover:z-20"
    >
      <div className="aspect-[2/3] rounded-lg overflow-hidden movie-card-shadow">
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Hover info */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="font-bold text-sm md:text-base leading-tight mb-1">{movie.title}</p>
          <div className="flex items-center space-x-2 text-[10px] md:text-xs">
            <span className="text-green-500 font-bold">{movie.rating} Rating</span>
            <span className="text-gray-400">{movie.duration}</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
             <button className="p-1.5 rounded-full border border-white/40 hover:border-white transition-colors">
               <Heart size={14} />
             </button>
             <button className="p-1.5 rounded-full border border-white/40 hover:border-white transition-colors ml-auto">
               <Play size={14} fill="currentColor" />
             </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
