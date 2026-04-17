export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  genre: string[];
  duration: string;
  thumbnail: string;
  backdrop: string;
  videoUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  watchlist: string[];
}
