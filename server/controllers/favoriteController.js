const Favorite = require("../models/Favorite");
const wrap = require("../utils/wrap");

exports.mine = wrap(async (req, res) => {
  const favs = await Favorite.find({ user: req.account._id }).populate("movie").sort({ createdAt: -1 });
  const movies = favs.map((f) => f.movie).filter(Boolean);
  res.json({ movies, ids: movies.map((m) => String(m._id)) });
});

exports.toggle = wrap(async (req, res) => {
  const filter = { user: req.account._id, movie: req.params.movieId };
  const existing = await Favorite.findOneAndDelete(filter);
  if (!existing) await Favorite.create(filter);
  res.json({ favorite: !existing });
});
