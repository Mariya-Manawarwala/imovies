const Review = require("../models/Review");
const Booking = require("../models/Booking");
const httpError = require("../utils/httpError");
const wrap = require("../utils/wrap");

exports.forMovie = wrap(async (req, res) => {
  const reviews = await Review.find({ movie: req.params.movieId }).populate("user", "username").sort({ updatedAt: -1 });
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  res.json({ reviews, average: Math.round(average * 10) / 10 });
});

// One review per user per movie; posting again updates it
exports.save = wrap(async (req, res) => {
  const { movieId, rating, comment = "" } = req.body;
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) throw httpError(400, "Choose a rating from 1 to 5");
  const booked = await Booking.exists({ user: req.account._id, movie: movieId, status: "confirmed" });
  if (!booked) throw httpError(403, "Book a ticket for this movie to review it");
  const review = await Review.findOneAndUpdate(
    { user: req.account._id, movie: movieId },
    { rating: r, comment },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ review });
});
