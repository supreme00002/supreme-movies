import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, Maximize, Settings, SkipForward } from "lucide-react";
import { Movie } from "../types";

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) window.clearTimeout(controlsTimeout.current);
    controlsTimeout.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (!movie) return null;

  return (
    <div 
      className="h-screen w-full bg-black relative flex items-center justify-center overflow-hidden cursor-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: showControls ? "auto" : "none" }}
    >
      <video
        ref={videoRef}
        src={movie.videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full p-8 flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="ml-6">
               <h2 className="text-xl font-bold opacity-80">{movie.title}</h2>
               <p className="text-xs text-gray-400 mt-1">S1:E1 • Pilot</p>
            </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 w-full p-8 space-y-6">
          {/* Progress bar */}
          <div className="group relative h-1.5 w-full bg-white/20 rounded-full cursor-pointer">
             <div 
               className="absolute left-0 top-0 h-full bg-red-600 rounded-full transition-all"
               style={{ width: `${progress}%` }}
             />
             <div 
               className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
               style={{ left: `${progress}%` }}
             />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
               <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
               </button>
               <button className="hover:scale-110 transition-transform">
                  <RotateCcw size={28} />
               </button>
               <button className="hover:scale-110 transition-transform">
                  <RotateCw size={28} />
               </button>
               <div className="flex items-center space-x-3 group">
                  <Volume2 size={24} />
                  <div className="w-24 h-1 bg-white/20 rounded-full">
                     <div className="w-1/2 h-full bg-white rounded-full" />
                  </div>
               </div>
            </div>

            <div className="flex items-center space-x-6">
               <button className="flex items-center space-x-2 text-sm font-bold opacity-80 hover:opacity-100">
                  <SkipForward size={24} />
                  <span>Next Episode</span>
               </button>
               <button className="opacity-80 hover:opacity-100">
                  <Settings size={24} />
               </button>
               <button className="opacity-80 hover:opacity-100">
                  <Maximize size={24} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
