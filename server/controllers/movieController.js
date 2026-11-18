const fs = require("fs");
const path = require("path");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
const Booking = require("../models/Booking");
const Favorite = require("../models/Favorite");
const Review = require("../models/Review");
const httpError = require("../utils/httpError");
const wrap = require("../utils/wrap");

const removeFile = (poster) => {
  if (!poster) return;
  fs.unlink(path.join(__dirname, "..", poster), () => {});
};

exports.list = wrap(async (req, res) => {
  const q = (req.query.search || "").trim();
  const filter = {};
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ movieName: re }, { genres: re }];
  }
  res.json({ movies: await Movie.find(filter).sort({ createdAt: -1 }) });
});

exports.getOne = wrap(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw httpError(404, "Movie not found");
  res.json({ movie });
});

exports.create = wrap(async (req, res) => {
  try {
    if (!req.file) throw httpError(400, "Poster image is required");
    const { movieName, description, genres = "", releaseDate, runtime, certification, trailerUrl } = req.body;
    const movie = await Movie.create({
      movieName,
      description,
      genres: String(genres).split(",").map((g) => g.trim()).filter(Boolean),
      releaseDate,
      runtime,
      certification,
      trailerUrl,
      poster: `/uploads/posters/${req.file.filename}`,
      createdBy: req.account._id,
    });
    res.status(201).json({ movie });
  } catch (err) {
    if (req.file) removeFile(`/uploads/posters/${req.file.filename}`);
    throw err;
  }
});

exports.remove = wrap(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw httpError(404, "Movie not found");
  const shows = await Show.find({ movie: movie._id }).select("_id");
  const ids = shows.map((s) => s._id);
  await Booking.updateMany({ show: { $in: ids } }, { status: "cancelled" });
  await Show.deleteMany({ movie: movie._id });
  await Favorite.deleteMany({ movie: movie._id });
  await Review.deleteMany({ movie: movie._id });
  await movie.deleteOne();
  removeFile(movie.poster);
  res.json({ message: "Movie deleted" });
});
