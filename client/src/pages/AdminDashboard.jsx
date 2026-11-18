import { useEffect, useState } from "react";
import { FiTrash2, FiVideo } from "react-icons/fi";
import { toast } from "react-toastify";
import api, { errMsg, fmtDate, fmt12, TIERS } from "../api";

export default function AdminDashboard() {
  const [shows, setShows] = useState(null);
  const [bookings, setBookings] = useState(null);

  const load = () => {
    api.get("/shows/admin").then((r) => setShows(r.data.shows)).catch(() => setShows([]));
    api.get("/bookings/admin").then((r) => setBookings(r.data.bookings)).catch(() => setBookings([]));
  };
  useEffect(load, []);

  const remove = async (s) => {
    if (!window.confirm("Delete this show? Its bookings will be cancelled.")) return;
    try {
      await api.delete(`/shows/${s._id}`);
      toast.success("Show deleted");
      load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="dash">
      <h1 className="title left">Admin <span>Shows</span></h1>
      {shows === null ? <p className="center-msg">Loading...</p> : shows.length === 0 ? (
        <p className="muted">No shows yet. Add a theatre, then add a show.</p>
      ) : (
        <div className="card-grid">
          {shows.map((s) => (
            <div key={s._id} className="info-card">
              <FiVideo className="ico" />
              <div>
                <p><span>Movie:</span> {s.movie?.movieName}</p>
                <p><span>Theatre:</span> {s.theatre?.theatreName}</p>
                <p><span>Showdate:</span> {fmtDate(s.showDate)}</p>
                <p><span>Showtime:</span> {fmt12(s.showTime)}</p>
                <button className="btn outline block" onClick={() => remove(s)} aria-label="Delete show"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h1 className="title left">All <span>Bookings</span></h1>
      {bookings === null ? <p className="center-msg">Loading...</p> : bookings.length === 0 ? (
        <p className="muted">No bookings yet.</p>
      ) : (
        <div className="card-grid two">
          {bookings.map((b) => (
            <div key={b._id} className="info-card">
              <FiVideo className="ico" />
              <div>
                <p><span>User:</span> {b.userEmail}</p>
                <p><span>Movie:</span> {b.movieName}</p>
                <p><span>Theatre:</span> {b.theatreName}</p>
                <p><span>Showdate:</span> {fmtDate(b.showDate)}</p>
                <p><span>Showtime:</span> {fmt12(b.showTime)}</p>
                {TIERS.filter(([k]) => b.seats[k]?.length).map(([k, label]) => <p key={k}><span>{label} Seats:</span> {b.seats[k].join(", ")}</p>)}
                <p><span>Total Price:</span> {b.totalPrice}₹ {b.status === "cancelled" && <em className="error">(cancelled)</em>}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
