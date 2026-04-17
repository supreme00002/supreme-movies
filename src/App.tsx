/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Player from "./pages/Player";
import Navbar from "./components/Navbar";
import { useEffect } from "react";

export default function App() {
  // Test Firestore/API connection (optional, here we test the local API)
  useEffect(() => {
    fetch("/api/movies")
      .then(res => res.json())
      .then(data => console.log("API Connected, loaded movies:", data.length))
      .catch(err => console.error("API Connection failed:", err));
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/player/:id" element={<Player />} />
          </Routes>
        </main>
        <footer className="py-10 border-t border-white/10 text-center text-sm text-gray-500">
          <p>&copy; 2026 Supreme Cinema. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}
