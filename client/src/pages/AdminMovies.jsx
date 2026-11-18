import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import api, { errMsg, fmtDate } from "../api";

export default function AdminMovies() {
  const [movies, setMovies] = useState(null);
  const load = () => api.get("/movies").then((r) => setMovies(r.data.movies)).catch(() => setMovies([]));
  useEffect(() => { load(); }, []);

  const remove = async (m) => {
    if (!window.confirm(`Delete "${m.movieName}"? Its shows will be removed and their bookings cancelled.`)) return;
    try {
      await api.delete(`/movies/${m._id}`);
      toast.success("Movie deleted");
      load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <>
      <div className="banner">Available Movies</div>
      {movies === null ? <p className="center-msg">Loading...</p> : movies.length === 0 ? (
        <p className="center-msg">No movies yet. Use the plus icon to add one.</p>
      ) : (
        <div className="movie-grid admin">
          {movies.map((m) => (
            <div key={m._id} className="poster-tile">
              <div className="poster-wrap">
                <img src={m.poster} alt={`${m.movieName} poster`} loading="lazy" />
                <button className="del" onClick={() => remove(m)} aria-label={`Delete ${m.movieName}`}><FiTrash2 /></button>
              </div>
              <h3>{m.movieName}</h3>
              <p className="muted">{fmtDate(m.releaseDate)}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
