import { useEffect, useState } from "react";
import api from "../api";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const [movies, setMovies] = useState(null);
  useEffect(() => {
    api.get("/favorites").then((r) => setMovies(r.data.movies)).catch(() => setMovies([]));
  }, []);
  return (
    <>
      <h1 className="title">Favorite <span>Movies</span></h1>
      {movies === null ? <p className="center-msg">Loading...</p> : movies.length === 0 ? (
        <p className="center-msg">No favorites yet. Tap the heart on a movie to save it here.</p>
      ) : (
        <div className="movie-grid">{movies.map((m) => <MovieCard key={m._id} movie={m} />)}</div>
      )}
    </>
  );
}
