import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get("/movies", { params: { search: q } }).then((r) => setMovies(r.data.movies)).catch(() => setMovies([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <h1 className="title">Available <span>Movies</span></h1>
      {movies === null ? <p className="center-msg">Loading...</p> : movies.length === 0 ? (
        <p className="center-msg">{q ? `No movies match "${q}".` : "No movies yet. Check back soon."}</p>
      ) : (
        <div className="movie-grid">{movies.map((m) => <MovieCard key={m._id} movie={m} />)}</div>
      )}
    </>
  );
}
