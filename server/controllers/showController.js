const mongoose = require("mongoose");
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const Booking = require("../models/Booking");
const httpError = require("../utils/httpError");
const wrap = require("../utils/wrap");
const { nowParts, isPast, DATE_RE, TIME_RE } = require("../utils/time");

// Upcoming shows for one movie (user side)
exports.forMovie = wrap(async (req, res) => {
  const { date, time } = nowParts();
  const shows = await Show.find({
    movie: req.params.movieId,
    $or: [{ showDate: { $gt: date } }, { showDate: date, showTime: { $gt: time } }],
  })
    .populate("theatre", "theatreName location balconySeatPrice middleSeatPrice lowerSeatPrice balconySeats middleSeats lowerSeats")
    .sort({ showDate: 1, showTime: 1 });
  res.json({ shows });
});

exports.getOne = wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw httpError(404, "Show not found");
  const show = await Show.findById(req.params.id).populate("theatre").populate("movie", "movieName poster");
  if (!show) throw httpError(404, "Show not found");
  res.json({ show });
});

// Shows created by the logged-in admin
exports.adminList = wrap(async (req, res) => {
  const shows = await Show.find({ admin: req.account._id })
    .populate("movie", "movieName")
    .populate("theatre", "theatreName")
    .sort({ showDate: 1, showTime: 1 });
  res.json({ shows });
});

exports.create = wrap(async (req, res) => {
  const { theatreId, movieId, showDate, showTime } = req.body;
  if (!DATE_RE.test(showDate || "") || !TIME_RE.test(showTime || "")) throw httpError(400, "Enter a valid date and time");
  if (isPast(showDate, showTime)) throw httpError(400, "Show time must be in the future");
  if (!mongoose.isValidObjectId(theatreId) || !mongoose.isValidObjectId(movieId)) throw httpError(400, "Select a theatre and a movie");
  const [theatre, movie] = await Promise.all([
    Theatre.findOne({ _id: theatreId, admin: req.account._id }),
    Movie.findById(movieId),
  ]);
  if (!theatre) throw httpError(400, "Theatre not found");
  if (!movie) throw httpError(400, "Movie not found");
  const show = await Show.create({ admin: req.account._id, movie: movie._id, theatre: theatre._id, showDate, showTime });
  res.status(201).json({ show });
});

exports.remove = wrap(async (req, res) => {
  const show = await Show.findOne({ _id: req.params.id, admin: req.account._id });
  if (!show) throw httpError(404, "Show not found");
  await Booking.updateMany({ show: show._id }, { status: "cancelled" });
  await show.deleteOne();
  res.json({ message: "Show deleted" });
});
