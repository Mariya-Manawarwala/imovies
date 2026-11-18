import { Link } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { fmtDate } from "../api";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <img src={movie.poster} alt={`${movie.movieName} poster`} loading="lazy" />
      <div className="info">
        <h3>{movie.movieName}</h3>
        <p><FiCalendar /> {fmtDate(movie.releaseDate)}</p>
        <div className="chips">
          {movie.genres.map((g) => <span key={g}>{g}</span>)}
        </div>
      </div>
    </Link>
  );
}
