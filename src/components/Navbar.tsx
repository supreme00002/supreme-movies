import React, { useState, useEffect } from "react";
import { Search, Bell, User, Menu, Play, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glass h-16" : "bg-gradient-to-b from-black/80 to-transparent h-20"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-white hover:text-red-500 transition-colors">
            SUPREME
          </Link>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="#" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
            <Link to="#" className="text-gray-300 hover:text-white transition-colors">Series</Link>
            <Link to="#" className="text-gray-300 hover:text-white transition-colors">New & Popular</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Titles, people, genres..."
                  className="bg-black/40 border border-white/20 rounded-full py-1 px-4 text-sm outline-none focus:border-red-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
            <Bell size={20} />
          </button>
          <button className="flex items-center space-x-2 p-1 pl-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <span className="hidden sm:block text-xs font-semibold">John Doe</span>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">J</div>
          </button>
        </div>
      </div>
    </nav>
  );
}
