const mongoose = require("mongoose");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const httpError = require("../utils/httpError");
const wrap = require("../utils/wrap");
const { isPast } = require("../utils/time");
const { sendBookingEmail } = require("../utils/mailer");

const TIERS = ["balcony", "middle", "lower"];

function cleanSeats(theatre, input) {
  const out = {};
  let count = 0;
  for (const t of TIERS) {
    const list = [...new Set((input?.[t] || []).map(Number))];
    if (list.some((n) => !Number.isInteger(n) || n < 1 || n > theatre[`${t}Seats`])) throw httpError(400, `Invalid ${t} seat selected`);
    out[t] = list;
    count += list.length;
  }
  if (count < 1 || count > 10) throw httpError(400, "Select between 1 and 10 seats");
  return out;
}

const priceOf = (theatre, seats) => TIERS.reduce((sum, t) => sum + seats[t].length * theatre[`${t}SeatPrice`], 0);

// Demo gateway. Replace with Razorpay/Stripe in production.
// Card ending 0000 is declined, so the "payment failed, try again" flow can be tested.
function charge(method, d) {
  if (method === "card") {
    const n = String(d.cardNumber || "").replace(/\s/g, "");
    if (!/^\d{16}$/.test(n)) return "Enter a valid 16-digit card number";
    if (n.endsWith("0000")) return "Card declined by the bank. Try again or use another payment method";
  } else if (method === "upi") {
    if (!/^[\w.-]{2,}@[\w]{2,}$/.test(d.upiId || "")) return "Enter a valid UPI ID, like name@bank";
  } else if (method === "netbanking") {
    if (!d.bank) return "Choose a bank";
  } else return "Choose a payment method";
  return null;
}

const release = (showId, seats) =>
  Show.updateOne(
    { _id: showId },
    { $pull: Object.fromEntries(TIERS.map((t) => [`bookedSeats.${t}`, { $in: seats[t] }])) }
  );

const code = () => `IM${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296).toString(36).toUpperCase()}`;

exports.pay = wrap(async (req, res) => {
  const { showId, seats: rawSeats, method, details = {} } = req.body;
  if (!mongoose.isValidObjectId(showId)) throw httpError(400, "Invalid show");
  const show = await Show.findById(showId).populate("theatre").populate("movie", "movieName");
  if (!show) throw httpError(404, "Show not found");
  if (isPast(show.showDate, show.showTime)) throw httpError(400, "This show has already started");

  const seats = cleanSeats(show.theatre, rawSeats);
  const amount = priceOf(show.theatre, seats);

  // Reserve seats atomically: fails if any chosen seat is already booked
  const filter = { _id: show._id };
  const add = {};
  for (const t of TIERS) {
    if (!seats[t].length) continue;
    filter[`bookedSeats.${t}`] = { $nin: seats[t] };
    add[`bookedSeats.${t}`] = { $each: seats[t] };
  }
  if (!(await Show.findOneAndUpdate(filter, { $addToSet: add })))
    throw httpError(409, "Some of those seats were just taken. Please choose other seats");

  const reference = `PAY-${code()}`;
  const failure = charge(method, details);
  if (failure) {
    await release(show._id, seats);
    if (["card", "upi", "netbanking"].includes(method))
      await Payment.create({ reference, user: req.account._id, show: show._id, amount, method, status: "failed", failureReason: failure });
    return res.status(402).json({ message: failure });
  }

  try {
    const booking = await Booking.create({
      bookingCode: code(),
      user: req.account._id,
      admin: show.admin,
      show: show._id,
      movie: show.movie._id,
      userEmail: req.account.email,
      movieName: show.movie.movieName,
      theatreName: show.theatre.theatreName,
      showDate: show.showDate,
      showTime: show.showTime,
      seats,
      totalPrice: amount,
    });
    const payment = await Payment.create({ reference, user: req.account._id, show: show._id, booking: booking._id, amount, method, status: "success" });
    booking.payment = payment._id;
    await booking.save();
    sendBookingEmail(booking).catch((e) => console.error("Email failed:", e.message));
    res.status(201).json({ booking });
  } catch (err) {
    await release(show._id, seats);
    throw err;
  }
});
