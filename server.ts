import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Movie Data
  const movies = [
    {
      id: "1",
      title: "Interstellar",
      description: "When Earth becomes uninhabitable, a team of ex-pilots and scientists is tasked with finding a new home for mankind in another galaxy.",
      year: 2014,
      rating: 8.7,
      genre: ["Sci-Fi", "Drama", "Adventure"],
      duration: "2h 49m",
      thumbnail: "https://picsum.photos/seed/interstellar/800/1200",
      backdrop: "https://picsum.photos/seed/interstellar-back/1920/1080",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: "2",
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      year: 2010,
      rating: 8.8,
      genre: ["Action", "Sci-Fi", "Adventure"],
      duration: "2h 28m",
      thumbnail: "https://picsum.photos/seed/inception/800/1200",
      backdrop: "https://picsum.photos/seed/inception-back/1920/1080",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: "3",
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      year: 2008,
      rating: 9.0,
      genre: ["Action", "Crime", "Drama"],
      duration: "2h 32m",
      thumbnail: "https://picsum.photos/seed/darkknight/800/1200",
      backdrop: "https://picsum.photos/seed/darkknight-back/1920/1080",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: "4",
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
      year: 2024,
      rating: 8.9,
      genre: ["Action", "Adventure", "Drama"],
      duration: "2h 46m",
      thumbnail: "https://picsum.photos/seed/dune2/800/1200",
      backdrop: "https://picsum.photos/seed/dune2-back/1920/1080",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: "5",
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      year: 2023,
      rating: 8.4,
      genre: ["Biography", "Drama", "History"],
      duration: "3h",
      thumbnail: "https://picsum.photos/seed/oppenheimer/800/1200",
      backdrop: "https://picsum.photos/seed/oppenheimer-back/1920/1080",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
      id: "6",
      title: "The Matrix",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      year: 1999,
      rating: 8.7,
      genre: ["Action", "Sci-Fi"],
      duration: "2h 16m",
      thumbnail: "https://picsum.photos/seed/matrix/800/1200",
      backdrop: "https://picsum.photos/seed/matrix-back/1920/1080",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
  ];

  // API Routes
  app.get("/api/movies", (req, res) => {
    const { genre, search } = req.query;
    let filteredMovies = [...movies];

    if (genre) {
      filteredMovies = filteredMovies.filter(m => m.genre.includes(genre as string));
    }

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredMovies = filteredMovies.filter(m => 
        m.title.toLowerCase().includes(searchLower) || 
        m.description.toLowerCase().includes(searchLower)
      );
    }

    res.json(filteredMovies);
  });

  app.get("/api/movies/:id", (req, res) => {
    const movie = movies.find(m => m.id === req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
