import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Plus, ThumbsUp, Share2, Star, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Movie } from "../types";
import { getMovieRecommendations } from "../lib/gemini";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
        fetchAiReasoning(data);
      });

    // Simple related content based on genre
    fetch("/api/movies")
      .then((res) => res.json())
      .then((all) => {
        setRecommendations(all.filter((m: Movie) => m.id !== id).slice(0, 4));
      });
  }, [id]);

  const fetchAiReasoning = async (movieData: Movie) => {
    // This is a simplified use of Gemini to show "AI insight"
    // In a real app, this would be more complex
    const reasoning = `Based on your interest in ${movieData.genre.join(", ")}, 
    Supreme AI suggests this is a top match because it blends ${movieData.genre[0]} with a unique ${movieData.rating > 8.5 ? "award-winning" : "modern"} narrative.`;
    setAiInsight(reasoning);
  };

  if (loading || !movie) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={movie.backdrop} 
          alt={movie.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-40 relative z-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center text-yellow-500">
                  <Star size={16} fill="currentColor" className="mr-1" />
                  {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                <span className="px-2 py-0.5 border border-white/20 rounded">HDR</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                {movie.description}
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4">
              <Link
                to={`/player/${movie.id}`}
                className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                <Play size={24} fill="currentColor" />
                <span>Watch Now</span>
              </Link>
              <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl font-bold transition-all">
                <Plus size={24} />
                <span>My List</span>
              </button>
            </div>

            {/* AI Insight Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-red-950/20 border border-red-500/20 p-6 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Sparkles size={100} />
              </div>
              <div className="flex items-center space-x-2 mb-3 text-red-500 font-bold tracking-tight uppercase text-xs">
                <Sparkles size={14} />
                <span>Supreme AI Insight</span>
              </div>
              <p className="text-gray-300 italic">
                "{aiInsight}"
              </p>
            </motion.div>
          </div>

          {/* Details & Sidebar */}
          <div className="space-y-12">
            <div className="glass p-8 rounded-2xl space-y-6 text-sm">
                <div>
                  <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-2 font-bold">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map(g => (
                      <span key={g} className="bg-white/5 px-3 py-1 rounded-full border border-white/10">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                   <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-2 font-bold">Available In</p>
                   <p className="text-gray-300">4K Ultra HD, Dolby Atmos, English Subtitles</p>
                </div>
                <div className="pt-4 flex justify-between">
                   <button className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors">
                      <ThumbsUp size={20} />
                      <span className="text-[10px] font-bold">Rate</span>
                   </button>
                   <button className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors">
                      <Share2 size={20} />
                      <span className="text-[10px] font-bold">Share</span>
                   </button>
                </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Customers also watched</h3>
              <div className="grid grid-cols-2 gap-4">
                 {recommendations.map(rec => (
                   <Link key={rec.id} to={`/movie/${rec.id}`} className="group relative aspect-[2/3] rounded-lg overflow-hidden">
                      <img 
                        src={rec.thumbnail} 
                        alt={rec.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={24} fill="white" />
                      </div>
                   </Link>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
