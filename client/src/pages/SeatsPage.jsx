import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api, { errMsg, fmtDate, TIERS } from "../api";

const empty = () => ({ balcony: [], middle: [], lower: [] });

export default function SeatsPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [step, setStep] = useState("select"); // select | review | payment | done
  const [sel, setSel] = useState(empty());
  const [method, setMethod] = useState("card");
  const [details, setDetails] = useState({ cardNumber: "", upiId: "", bank: "" });
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  const load = () => api.get(`/shows/${showId}`).then((r) => setShow(r.data.show)).catch(() => setShow(false));
  useEffect(() => { load(); }, [showId]);

  if (show === null) return <p className="center-msg">Loading...</p>;
  if (show === false) return <p className="center-msg">Show not found.</p>;

  const t = show.theatre;
  const total = TIERS.reduce((s, [k]) => s + sel[k].length * t[`${k}SeatPrice`], 0);
  const count = TIERS.reduce((s, [k]) => s + sel[k].length, 0);

  const toggle = (tier, n) => {
    if (!sel[tier].includes(n) && count >= 10) return toast.info("You can book up to 10 seats at a time");
    setSel((s) => ({
      ...s,
      [tier]: s[tier].includes(n) ? s[tier].filter((x) => x !== n) : [...s[tier], n].sort((a, b) => a - b),
    }));
  };

  const pay = async (e) => {
    e.preventDefault();
    setPaying(true);
    setError("");
    try {
      const { data } = await api.post("/payments", { showId, seats: sel, method, details });
      setBooking(data.booking);
      setStep("done");
      toast.success("Booking confirmed. A confirmation was sent to your email");
    } catch (err) {
      const msg = errMsg(err);
      setError(msg);
      if (err.response?.status === 409) {
        toast.error(msg);
        setSel(empty());
        setStep("select");
        load();
      }
    } finally {
      setPaying(false);
    }
  };

  const summary = (
    <div className="panel summary">
      <p><b>Movie:</b> {show.movie.movieName}</p>
      <p><b>Theatre:</b> {t.theatreName}, {t.location}</p>
      <p><b>Date:</b> {fmtDate(show.showDate)} <b>Time:</b> {show.showTime}</p>
      {TIERS.filter(([k]) => sel[k].length).map(([k, label]) => (
        <p key={k}><b>{label} seats:</b> {sel[k].join(", ")} ({sel[k].length} x {t[`${k}SeatPrice`]}₹)</p>
      ))}
      <p className="total"><b>Total:</b> {total}₹</p>
    </div>
  );

  if (step === "done") {
    return (
      <div className="narrow">
        <h1 className="title">Booking <span>Confirmed</span></h1>
        <div className="panel summary">
          <p><b>Booking code:</b> {booking.bookingCode}</p>
          <p><b>Movie:</b> {booking.movieName}</p>
          <p><b>Theatre:</b> {booking.theatreName}</p>
          <p><b>Date:</b> {fmtDate(booking.showDate)} <b>Time:</b> {booking.showTime}</p>
          {TIERS.filter(([k]) => booking.seats[k].length).map(([k, label]) => <p key={k}><b>{label} seats:</b> {booking.seats[k].join(", ")}</p>)}
          <p className="total"><b>Paid:</b> {booking.totalPrice}₹</p>
        </div>
        <div className="row">
          <Link className="btn" to="/bookings">View my bookings</Link>
          <Link className="btn outline" to={`/movie/${show.movie._id}`}>Rate this movie</Link>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="narrow">
        <h1 className="title">Review <span>Booking</span></h1>
        {summary}
        <p className="center-msg">Confirm booking?</p>
        <div className="row">
          <button className="btn" onClick={() => setStep("payment")}>Yes, continue to payment</button>
          <button className="btn outline" onClick={() => setStep("select")}>No, change seats</button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="narrow">
        <h1 className="title">Make <span>Payment</span></h1>
        {summary}
        <form className="panel form-col" onSubmit={pay}>
          <label>Payment method
            <select value={method} onChange={(e) => { setMethod(e.target.value); setError(""); }}>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net banking</option>
            </select>
          </label>
          {method === "card" && (
            <label>Card number
              <input inputMode="numeric" maxLength={19} placeholder="4242 4242 4242 4242" value={details.cardNumber} onChange={(e) => setDetails({ ...details, cardNumber: e.target.value })} />
            </label>
          )}
          {method === "upi" && (
            <label>UPI ID
              <input placeholder="name@bank" value={details.upiId} onChange={(e) => setDetails({ ...details, upiId: e.target.value })} />
            </label>
          )}
          {method === "netbanking" && (
            <label>Bank
              <select value={details.bank} onChange={(e) => setDetails({ ...details, bank: e.target.value })}>
                <option value="">Select bank</option>
                {["SBI", "HDFC", "ICICI", "Axis"].map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
          )}
          {error && <p className="error" role="alert">Payment failed: {error}</p>}
          <div className="row">
            <button className="btn" disabled={paying}>{paying ? "Processing..." : error ? `Retry payment of ${total}₹` : `Pay ${total}₹`}</button>
            <button type="button" className="btn outline" onClick={() => setStep("review")}>Back</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="narrow wide">
      <h1 className="title">{show.movie.movieName}</h1>
      <p className="center-msg">{t.theatreName}, {t.location} | {fmtDate(show.showDate)} | {show.showTime}</p>
      <div className="screen">Screen this way</div>
      {TIERS.filter(([k]) => t[`${k}Seats`] > 0).map(([k, label]) => (
        <div key={k} className="tier">
          <h3>{label} <small>{t[`${k}SeatPrice`]}₹ per seat</small></h3>
          <div className="seats">
            {Array.from({ length: t[`${k}Seats`] }, (_, i) => i + 1).map((n) => {
              const taken = show.bookedSeats[k].includes(n);
              const on = sel[k].includes(n);
              return (
                <button key={n} disabled={taken} className={`seat ${on ? "on" : ""}`} onClick={() => toggle(k, n)} aria-pressed={on} aria-label={`${label} seat ${n}${taken ? " taken" : ""}`}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="legend"><i className="seat" /> Available <i className="seat on" /> Selected <i className="seat" disabled /> Taken</div>
      <div className="bar">
        <span>{count} seat{count === 1 ? "" : "s"} | {total}₹</span>
        <button className="btn" disabled={!count} onClick={() => setStep("review")}>Review booking</button>
      </div>
      <button className="link-btn" onClick={() => navigate(-1)}>Back to movie</button>
    </div>
  );
}
