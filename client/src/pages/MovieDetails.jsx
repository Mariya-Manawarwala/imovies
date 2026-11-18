import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import api, { errMsg, fmtDate } from "../api";
import { useAuth } from "../context/AuthContext";

const ytId = (url) => (url || "").match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1];

export default function MovieDetails() {
  const { id } = useParams();
  const { account } = useAuth();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [fav, setFav] = useState(false);
  const [reviews, setReviews] = useState({ reviews: [], average: 0 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const loadReviews = () => api.get(`/reviews/movie/${id}`).then((r) => setReviews(r.data));

  useEffect(() => {
    api.get(`/movies/${id}`).then((r) => setMovie(r.data.movie)).catch(() => setMovie(false));
    api.get(`/shows/movie/${id}`).then((r) => setShows(r.data.shows));
    api.get("/favorites").then((r) => setFav(r.data.ids.includes(id)));
    loadReviews();
  }, [id]);

  const toggleFav = async () => {
    try {
      const { data } = await api.post(`/favorites/${id}`);
      setFav(data.favorite);
      toast.success(data.favorite ? "Added to favorites" : "Removed from favorites");
    } catch (e) { toast.error(errMsg(e)); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", { movieId: id, rating, comment });
      toast.success("Review saved");
      setComment("");
      loadReviews();
    } catch (err) { toast.error(errMsg(err)); }
  };

  if (movie === null) return <p className="center-msg">Loading...</p>;
  if (movie === false) return <p className="center-msg">Movie not found.</p>;

  const trailer = ytId(movie.trailerUrl);
  const byDate = shows.reduce((acc, s) => ((acc[s.showDate] ||= []).push(s), acc), {});

  return (
    <div className="details">
      <div className="details-top">
        <img src={movie.poster} alt={`${movie.movieName} poster`} />
        <div>
          <h1>{movie.movieName}
            <button className="icon-btn" onClick={toggleFav} aria-label="Toggle favorite">{fav ? <FaHeart color="#dc143c" /> : <FiHeart />}</button>
          </h1>
          <p className="muted">{fmtDate(movie.releaseDate)} | {movie.runtime} min | {movie.certification}
            {reviews.average > 0 && <> | <FaStar color="#f5b301" /> {reviews.average}</>}</p>
          <div className="chips">{movie.genres.map((g) => <span key={g}>{g}</span>)}</div>
          <p>{movie.description}</p>
        </div>
      </div>

      {trailer && (
        <iframe className="trailer" src={`https://www.youtube.com/embed/${trailer}`} title="Trailer" allowFullScreen />
      )}

      <h2 className="title left">Book <span>Tickets</span></h2>
      {shows.length === 0 ? <p className="muted">No upcoming shows for this movie.</p> : Object.entries(byDate).map(([date, list]) => (
        <div key={date} className="panel">
          <h3>{fmtDate(date)}</h3>
          <div className="show-list">
            {list.map((s) => (
              <Link key={s._id} to={`/seats/${s._id}`} className="show-pill">
                <strong>{s.showTime}</strong>
                <span>{s.theatre.theatreName}, {s.theatre.location}</span>
                <small>from {Math.min(...["balcony", "middle", "lower"].filter((t) => s.theatre[`${t}Seats`] > 0).map((t) => s.theatre[`${t}SeatPrice`]))}₹</small>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <h2 className="title left">Reviews</h2>
      {account?.role === "user" && (
        <form className="panel review-form" onSubmit={submitReview}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                <FaStar color={n <= rating ? "#f5b301" : "#6b7280"} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share what you thought (optional)" maxLength={1000} />
          <button className="btn" disabled={!rating}>Post review</button>
        </form>
      )}
      {reviews.reviews.length === 0 ? <p className="muted">No reviews yet.</p> : reviews.reviews.map((r) => (
        <div key={r._id} className="panel review">
          <strong>{r.user?.username || "User"}</strong>
          <span>{[...Array(r.rating)].map((_, i) => <FaStar key={i} color="#f5b301" />)}</span>
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
