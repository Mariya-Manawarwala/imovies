const Booking = require("../models/Booking");
const wrap = require("../utils/wrap");

exports.mine = wrap(async (req, res) => {
  const bookings = await Booking.find({ user: req.account._id })
    .populate("movie", "movieName poster")
    .sort({ createdAt: -1 });
  res.json({ bookings });
});

// Every booking made for this admin's shows
exports.adminAll = wrap(async (req, res) => {
  const bookings = await Booking.find({ admin: req.account._id }).sort({ createdAt: -1 });
  res.json({ bookings });
});
