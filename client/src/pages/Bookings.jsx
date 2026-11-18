import { useEffect, useState } from "react";
import api, { fmtDate, TIERS } from "../api";

export default function Bookings() {
  const [list, setList] = useState(null);
  useEffect(() => {
    api.get("/bookings/mine").then((r) => setList(r.data.bookings)).catch(() => setList([]));
  }, []);
  return (
    <>
      <h1 className="title">Your <span>Bookings</span></h1>
      {list === null ? <p className="center-msg">Loading...</p> : list.length === 0 ? (
        <p className="center-msg">You have no bookings yet.</p>
      ) : (
        <div className="booking-grid">
          {list.map((b) => (
            <div key={b._id} className="booking">
              <img src={b.movie?.poster || "/placeholder.svg"} alt="" />
              <div>
                <p><span>Movie:</span> {b.movieName}</p>
                <p><span>Theatre:</span> {b.theatreName}</p>
                <p><span>Showdate:</span> {fmtDate(b.showDate)}</p>
                <p><span>showtime:</span> {b.showTime}</p>
                {TIERS.filter(([k]) => b.seats[k]?.length).map(([k, label]) => (
                  <p key={k}><span>{label} Seats:</span> {b.seats[k].join(",  ")}</p>
                ))}
                <p><span>Total Price:</span> {b.totalPrice}₹</p>
                {b.status === "cancelled" && <p className="error">Cancelled (show removed)</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
